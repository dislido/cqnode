const http = require('http');
const type = require('./type');

const sendMsgTypeMap = {
  group: 'group_id',
  private: 'user_id',
};

const receivedMsgTypeMap = {
  GROUP: 'groupMessage',
  PRIVATE: 'privateMessage',
};
module.exports = class CQHttpConnector {
  /**
   * cq-http插件的连接器
   * @param {CQNode} cqnode cqnode实例
   * @param {Object} config 端口设置
   * @param {number} config.LISTEN_PORT 接收消息端口
   * @param {number} config.API_PORT 调用API端口
   */
  constructor(cqnode, { LISTEN_PORT = 6363, API_PORT = 5700 } = {}) {
    this.server = http.createServer((req, resp) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      }).on('end', () => {
        this.onMsgReceived(JSON.parse(data), resp);
      });
    }).listen(LISTEN_PORT);
    this.API_PORT = API_PORT;
    this.cqnode = cqnode;
    this.requestAPI('/get_login_info').then((data) => {
      this.user = data;
    });
  }

  /**
   * 接收消息事件
   * @param {Object} msg 接收到的消息对象
   * @param {http.ServerResponse} resp 响应对象
   * @returns {string} reply信息
   */
  async onMsgReceived(msg, resp) {
    if (msg.post_type === 'message') {
      if (msg.message_type === 'group') {
        await this.cqnode.emit(receivedMsgTypeMap.GROUP, { msg: type.groupMessage(msg), resp });
      } else if (msg.message_type === '') {
        
      }
      return resp.end();
    }
    // this.sendMsg('group', msg.group_id, `received ${msg.message}`);
    return null;
  }

  // ====================
  //         API
  // ====================

  /**
   * 进行API请求
   * @param {string} path 请求地址
   * @param {Object} body 请求内容
   * @returns {Promise<JSON>} 响应数据
   */
  requestAPI(path, body) {
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
      }).on('data', (chunk) => {
        data += chunk;
      }).on('end', () => {
        resolve(data && JSON.parse(data));
      }).end(content);
    });
  }

  /**
   * 发送消息
   * @param {string} messageType 发送类型 group|private
   * @param {number} target 发送目标群号码/QQ号码
   * @param {string} message 消息内容
   */
  sendMsg(messageType, target, message) {
    this.requestAPI('/send_msg', {
      message_type: messageType,
      [sendMsgTypeMap[messageType]]: target,
      message,
    });
  }
};
