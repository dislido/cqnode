import * as http from 'http';
import Robot from '../cqnode-robot';
import api from './api';
import * as eventType from './event-type';
import { toUnderScoreCase, toCamelCase, decodeHtml } from '../util';

/** CQHTTP设置 */
declare interface CQHTTPConfig {
  /** 接收消息端口，对应post_url的端口 */
  LISTEN_PORT?: number,
  /** 调用API端口，对应port */
  API_PORT?: number,
  /** response超时时间 */
  TIMEOUT?: number,
}

export default class CQHttpConnector {
  server: http.Server;
  API_PORT: number;
  LISTEN_PORT: number;
  TIMEOUT: number;
  user: any;
  api: CQAPI = new Proxy(api, {
    get: (target: any, apiName: string) => (...args: any[]) => {
      if (typeof apiName === 'symbol') return;
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
  constructor(public cqnode: Robot, { LISTEN_PORT = 8080, API_PORT = 5700, TIMEOUT = 10000 }: CQHTTPConfig = {}) {
    this.server = http.createServer((req, resp) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      }).on('end', () => {
        resp.setHeader('Content-Type', 'application/json');
        this.onMsgReceived(toCamelCase(JSON.parse(decodeHtml(data))) as CQEvent.Event, resp);
      });
    }).listen(LISTEN_PORT);
    this.API_PORT = API_PORT;
    this.LISTEN_PORT = LISTEN_PORT;
    this.TIMEOUT = TIMEOUT;
  }

  /**
   * 接收消息事件
   * @param {Object} event 接收到的消息对象
   * @param {http.ServerResponse} resp 响应对象
   */
  onMsgReceived(event: CQEvent.Event, resp: http.ServerResponse) {
    this.cqnode.emit(eventType.assertEventName(event), toCamelCase(event), resp);
    if (this.TIMEOUT) setTimeout(() => !resp.finished && resp.end(), this.TIMEOUT);
  }

  /**
   * 进行API请求
   * @param {string} path 请求地址
   * @param {Object} body 请求内容
   * @returns {Promise<JSON>} 响应数据
   */
  requestAPI(path: string, body?: object) {
    const content = body ? JSON.stringify(body) : '';
    return new Promise((resolve, reject) => {
      let data = '';
      http.request({
        host: '127.0.0.1',
        port: this.API_PORT,
        path,
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Content-length': content.length,
        },
      }, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        }).on('end', () => {
          resolve(data && JSON.parse(data));
        });
      }).on('error', err => reject(err)).end(content);
    });
  }
};

