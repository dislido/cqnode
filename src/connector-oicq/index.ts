import { EventEmitter } from 'events';
import { createClient, Client, Config } from 'oicq';
import CQEventType, { allLeafEventNames, CQEvent } from './event-type';
import pickOicqApi, { OICQAPI } from './proxy-oicq-api';

export interface OicqConfig extends Config {
  /** 登录qq号 */
  account: number;
  /** qq密码，不传则使用扫码登录 */
  password?: string;
  /** 自定义login事件监听，不再监听回车来重试登录，需要使用提供的retry来重试登录 */
  onLogin?(data: { type: string; data: any }, retry: () => void): Promise<void>;
}

export default class OicqConnector extends EventEmitter {
  client: Client;

  api: OICQAPI;

  /**
   * oicq
   * @param cqnode cqnode实例
   * @param config CQHTTP设置
   */
  constructor(private config: OicqConfig) {
    super();
    const {
      account, password, onLogin, ...oicq
    } = config;
    this.client = createClient(account, {
      log_level: 'off',
      ignore_self: false,
      ...oicq,
    });
    this.api = pickOicqApi(this.client);

    allLeafEventNames.forEach(en => {
      this.client.on(en, (ev: any) => {
        this.onEventReceived(en, ev);
      });
    });
  }

  init() {
    const { onLogin } = this.config;
    this.client.on('system.login.qrcode', data => {
      // 扫码后按回车登录
      console.log('扫码成功后请按回车');
      onLogin?.({ type: 'qrcode', data }, () => this.client.login());
      if (!onLogin) process.stdin.once('data', () => this.client.login());
    }).on('system.login.slider', e => {
      console.log(`滑动验证： ${e.url}`);
      console.log('输入ticket：');
      onLogin?.({ type: 'slider', data: e }, () => this.client.login());
      if (!onLogin) {
        process.stdin.once('data', ticket => {
          const ticketStr = String(ticket).trim();
          console.log(`已输入<${ticketStr}>`);
          this.client.submitSlider(ticketStr);
        });
      }
    }).on('system.login.device', e => {
      console.log(`设备锁验证(验证完成后按回车登录)：${e.url}`);
      onLogin?.({ type: 'device', data: e }, () => this.client.login());
      if (!onLogin) process.stdin.once('data', () => this.client.login());
    }).login(this.config.password);
    return new Promise(res => this.client.once('system.online', res));
  }

  /**
   * 接收事件
   * @param {Object} event 接收到的事件对象
   * @param {http.ServerResponse} resp 响应对象
   */
  onEventReceived<T extends CQEventType>(eventName: T, event: CQEvent<T>) {
    const ev = event || {} as any;
    Reflect.set(ev, 'eventType', eventName);
    this.emit('event', ({ eventName, event: ev }));
  }
}
