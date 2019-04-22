import * as http from 'http';
import CQNodeRobot from '../cqnode-robot';
import api from './api';
import * as eventType from './event-type';

function toUnderScoreCase(str: string) {
    return str.replace(/[(A-Z)]/g, it => `_${it.toLowerCase()}`);
}

declare interface CQHTTPConfig {
  LISTEN_PORT?: number,
  API_PORT?: number,
}

export default class CQHttpConnector {
  server: http.Server;
  API_PORT: number;
  LISTEN_PORT: number;
  user: any;
  api: CQAPI = new Proxy(api, {
    get: (target: any, apiName: string) => {
      return (...args: any[]) => {
        const requestBody = target[apiName](...args);
        return this.requestAPI(`/${toUnderScoreCase(apiName)}`, requestBody);
      };
    }
  });
  /**
   * cq-http插件的连接器
   * @param {CQNode} cqnode cqnode实例
   * @param {Object} config 端口设置
   * @param {number} config.LISTEN_PORT 接收消息端口
   * @param {number} config.API_PORT 调用API端口
   */
  constructor(public cqnode: CQNodeRobot, { LISTEN_PORT = 6363, API_PORT = 5700 }: CQHTTPConfig = {}) {
    this.server = http.createServer((req, resp) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      }).on('end', () => {
        this.onMsgReceived(JSON.parse(data), resp);
      });
    }).listen(LISTEN_PORT);
    this.API_PORT = API_PORT;
    this.LISTEN_PORT = LISTEN_PORT;
    const t = await this.api.sendDiscussMsg(123456789,'hello');
    t.
  }

  /**
   * 接收消息事件
   * @param {Object} event 接收到的消息对象
   * @param {http.ServerResponse} resp 响应对象
   * @returns {string} reply信息
   */
  async onMsgReceived(event: CQEvent.Event, resp: http.ServerResponse) {
    return await this.cqnode.emit(eventType.assertEventName(event), { event, resp });
  }

  /**
   * 进行API请求
   * @param {string} path 请求地址
   * @param {Object} body 请求内容
   * @returns {Promise<JSON>} 响应数据
   */
  requestAPI(path: string, body?: object) {
    const content = body ? JSON.stringify(body) : '';
    return new Promise((resolve) => {
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
      }).end(content);
    });
  }
};

