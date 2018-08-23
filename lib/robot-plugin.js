const { bindingCQNode } = require('./symbols');

class CQNodePlugin {
  constructor() {
    this[bindingCQNode] = null;
  }
  /**
   * @param {object} data 发送消息数据
   * @param {string} data.msg 消息内容
   * @param {number} data.act 消息类型
   * @param {string} data.to 发送目标
   */
  beforeSendMessage(data) {} // eslint-disable-line no-unused-vars,class-methods-use-this
}

CQNodePlugin.symbols = {
  bindingCQNode,
};

module.exports = CQNodePlugin;
