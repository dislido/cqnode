const CQNodeModule = require('../robot-module');
const symbols = require('../symbols');

const { bindingCQNode } = symbols;

module.exports = class BuiltinSvcModule extends CQNodeModule {
  constructor() {
    super();
    this.config = {
      prompt: '~$',
      needAt: false,
    };
    this.inf = {
      name: 'BuiltinSvccModule',
      help: '',
      description: '',
      packageName: 'builtin.svcModule',
      hidden: true,
    };
  }
  /**
   * @param {object} msgData
   * @param {string} msgData.msg
   */
  requestSvc(msgData, resp) {
    if (msgData.msg.startsWith(this.config.prompt)) {
      const result = this[bindingCQNode]
        .moduleSvcManager
        .requestSvc(...msgData.msg.substring(this.config.prompt.length).trim().split(' '));
      if (!result) return false;
      resp.send(result);
      return true;
    }
    return false;
  }
  onGroupMessage(msgData, resp) {
    if (this.config.needAt && !msgData.atme) return false;
    return this.requestSvc(msgData, resp);
  }
  onPrimaryMessage(msgData, resp) {
    return this.requestSvc(msgData, resp);
  }
};
