const http = require('http');

const sendMsgTypeMap = {
  group: 'group_id',
  private: 'user_id',
};

const receivedMsgTypeMap = {
  group: 'groupMessage',
  private: 'privateMessage',
};

module.exports = class CQHttpConnector {
  constructor(cqnode, LISTEN_PORT = 6363, API_PORT = 5700) {
    this.server = http.createServer((req, resp) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      }).on('end', () => {
        resp.end(this.onMsgReceived(JSON.parse(data)));
      });
    }).listen(LISTEN_PORT);

    this.API_PORT = API_PORT;
    this.cqnode = cqnode;
  }

  onMsgReceived(msg) {
    // if (msg.post_type === 'message') {
    //   this.cqnode.emit(receivedMsgTypeMap[msg.message_type]);
    // }
    // this.sendMsg('group', msg.group_id, `received ${msg.message}`);
    return JSON.stringify({
      reply: 'ok',
    });
  }

  /**
   * 发送消息
   * @param {string} messageType 发送类型 group|private
   * @param {number} target 发送目标群号码/QQ号码
   * @param {string} message 消息内容
   */
  sendMsg(messageType, target, message) {
    const body = JSON.stringify({
      message_type: messageType,
      [sendMsgTypeMap[messageType]]: target,
      message,
    });
    http.request({
      host: '127.0.0.1',
      port: this.API_PORT,
      path: '/send_msg',
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Content-length': body.length,
      }
    }).end(body);
  }
};
