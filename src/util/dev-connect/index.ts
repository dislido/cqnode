import { EventEmitter } from 'events';
import { createClient, Client } from 'oicq';
import CQEventType, { allLeafEventNames, CQEvent } from '../../connector-oicq/event-type';

export interface OicqConfig {
  /** 登录qq号 */
  account: number;
  /** qq密码，不传则使用扫码登录 */
  password?: string;
  timeout?: number;
}

export default class OicqConnector extends EventEmitter {
  client: Client;

  constructor(private config: OicqConfig) {
    super();
    const { account } = config;
    this.client = createClient(account, { log_level: 'off' });

    allLeafEventNames.forEach((en: CQEventType) => {
      this.client.on(en, (ev: CQEvent) => {
        this.onEventReceived(en, ev);
      });
    });
  }

  init() {
    this.client.once('system.login.qrcode', () => {
      // 扫码后按回车登录
      console.log('扫码成功后请按回车');
      process.stdin.once('data', () => this.client.login());
    }).once('system.login.slider', e => {
      console.log(`滑动验证： ${e.url}`);
      console.log('输入ticket：');
      process.stdin.once('data', ticket => this.client.submitSlider(String(ticket).trim()));
    }).once('system.login.device', e => {
      console.log(`设备锁验证：${e.url}`);
      process.stdin.once('data', () => this.client.login());
    }).login(this.config.password);
    return new Promise(res => this.client.once('system.online', res));
  }

  /**
   * 接收事件
   * @param {Object} event 接收到的事件对象
   * @param {http.ServerResponse} resp 响应对象
   */
  onEventReceived(eventName: CQEventType, event: CQEvent) {
    this.emit('event', ({ eventName, event }));
  }
}
