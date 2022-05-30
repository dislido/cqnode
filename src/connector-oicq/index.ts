import * as http from 'http';
import Robot from '../cqnode-robot';
import api from './api';
import { assertEventName } from './event-type';
import CQAPI from './api';
import { CQEvent } from '../../types/connector';
import { createClient, Client } from 'oicq';

export interface OicqConfig {
  /** 登录qq号 */
  account: number;
  /** qq密码，不传则使用扫码登录 */
  password?: string; 
  timeout?: number;
}

export default class OicqConnector {
  user: any;
  api: typeof CQAPI = new Proxy(api, {
    get: (target: any, apiName: string) => (...args: any[]) => {
      if (!target[apiName]) {
        console.warn('CONode warn: no API: ', apiName);
        return;
      }
      return this.requestAPI(`/${apiName}`, target[apiName](...args));
    },
  });
  client: Client;
  /**
   * oicq插件的连接器
   * @param cqnode cqnode实例
   * @param config CQHTTP设置
   */
  constructor(public cqnode: Robot, private config: OicqConfig) {
    const { account } = config;
    this.client = createClient(account, { log_level: 'off' });

    const eventListener = (e: any) => this.onEventReceived(e, {} as any);
    this.client.on('message', eventListener);
    this.client.on('request', eventListener);
    this.client.on('notice', eventListener);
    this.client.on('system', eventListener);
  }

  init() {
    this.client.once('system.login.qrcode', () => {
      //扫码后按回车登录
      console.log('扫码成功后请按回车');
      process.stdin.once('data', () => this.client.login());
    }).login(this.config.password);
    return new Promise(res => this.client.once('system.online', res));
  }

  /**
   * 接收事件
   * @param {Object} event 接收到的事件对象
   * @param {http.ServerResponse} resp 响应对象
   */
  onEventReceived(event: CQEvent.Event, resp: http.ServerResponse) {
    const eventName = assertEventName(event);
    const eventObj = event as CQEvent.Event;
    const plgret = this.cqnode.pluginManager.emit('onEventReceived', { eventName, event: eventObj });
    if (!plgret) return;
    this.cqnode.emit(plgret.eventName, plgret.event, resp);
  }

  /**
   * 进行API请求
   * @param {string} path 请求地址
   * @param {Object} body 请求内容
   * @returns {Promise<JSON>} 响应数据
   */
  requestAPI(path: string, body?: object) {
    const content = body ? JSON.stringify(body) : '';
    const reqOpt: any = {
      host: '127.0.0.1',
      path,
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Content-length': Buffer.byteLength(content),
      },
    };
    return new Promise((resolve, reject) => {
      let data = '';
      http.request(reqOpt, (res) => {
        res.setEncoding('utf8');
        switch (res.statusCode) {
          case 400: throw new Error('cqnode: POST 请求的正文格式不正确');
          case 401: throw new Error('cqnode: access token 未提供');
          case 403: throw new Error('cqnode: access token 不正确');
          case 404: throw new Error('cqnode: API 不存在');
          case 406: throw new Error('cqnode: POST 请求的 Content-Type 不支持');
        }

        res.on('data', (chunk) => {
          data += chunk;
        }).on('end', () => {
          resolve(data && JSON.parse(data));
        });
      }).on('error', err => reject(err)).end(content);
    });
  }
}
