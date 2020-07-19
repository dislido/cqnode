import * as http from 'http';
import Robot from '../cqnode-robot';
import api from './api';
import { assertEventName } from './event-type';
import { toUnderScoreCase, toCamelCase, decodeHtml } from '../util';
import CQAPI from './api';
import { CQEvent } from '../../types/cq-http';

/** CQHTTP设置 */
declare interface CQHTTPConfig {
  /** 接收消息端口，对应post_url的端口 */
  LISTEN_PORT?: number;
  /** 调用API端口，对应port */
  API_PORT?: number;
  /** response超时时间 */
  TIMEOUT?: number;
  /** access_token */
  ACCESS_TOKEN?: string;
}

export default class CQHttpConnector {
  server: http.Server;
  API_PORT: number;
  LISTEN_PORT: number;
  TIMEOUT: number;
  ACCESS_TOKEN?: string;
  user: any;
  api: typeof CQAPI = new Proxy(api, {
    get: (target: any, apiName: string) => (...args: any[]) => {
      if (!target[apiName]) {
        console.warn('CONode warn: no API: ', apiName);
        return;
      }
      return this.requestAPI(`/${toUnderScoreCase(apiName)}`, target[apiName](...args));
    },
  });
  /**
   * cq-http插件的连接器
   * @param cqnode cqnode实例
   * @param config CQHTTP设置
   */
  constructor(public cqnode: Robot, {
    LISTEN_PORT = 8080,
    API_PORT = 5700,
    TIMEOUT = 10000,
    ACCESS_TOKEN }: CQHTTPConfig = {}) {
    
    this.API_PORT = API_PORT;
    this.LISTEN_PORT = LISTEN_PORT;
    this.TIMEOUT = TIMEOUT;
    this.ACCESS_TOKEN = ACCESS_TOKEN;
  }

  async init() {
    this.server = await new Promise((res) => {
      const server = http.createServer((req, resp) => {
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        }).on('end', () => {
          resp.setHeader('Content-Type', 'application/json');
          let event: CQEvent.Event | null = null;
          try {
            event = toCamelCase(JSON.parse(decodeHtml(data))) as CQEvent.Event;
          } catch (e) {
            console.error(`[cqnode error]: parse Event failed ->`, data, '<-');
          }
          if (event) this.onEventReceived(event, resp);
        });
      }).listen(this.LISTEN_PORT, () => res(server));
    });
    return this;
  }

  /**
   * 接收事件
   * @param event 接收到的事件对象
   * @param resp 响应对象
   */
  async onEventReceived(event: CQEvent.Event, resp: http.ServerResponse) {
    let eventName = assertEventName(event);
    let eventObj = toCamelCase(event) as CQEvent.Event;
    const plgret = await this.cqnode.pluginManager.emit('onEventReceived', { eventName, event: eventObj });
    if (!plgret) return;
    this.cqnode.emit(plgret.eventName, plgret.event, resp);
    if (this.TIMEOUT) setTimeout(() => !resp.finished && resp.end(), this.TIMEOUT);
  }

  /**
   * 进行API请求
   * @param path 请求地址
   * @param body 请求内容
   * @returns 响应数据
   */
  requestAPI(path: string, body?: object) {
    const content = body ? JSON.stringify(body) : '';
    const reqOpt: any = {
      host: '127.0.0.1',
      port: this.API_PORT,
      path,
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Content-length': Buffer.byteLength(content),
      },
    };
    if (this.ACCESS_TOKEN) reqOpt.headers['Authorization'] = `Bearer ${this.ACCESS_TOKEN}`;
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
};

