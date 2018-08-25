const CQNodeModule = require('../robot-module');
const symbols = require('../symbols');

const { bindingCQNode } = symbols;

module.exports = class BuiltinAdminModule extends CQNodeModule {
  constructor(prompt) {
    super();
    this.config = {
      prompt,
    };
    this.inf = {
      name: 'BuiltinAdmincModule',
      help: '',
      description: '',
      packageName: 'builtin.AdminModule',
      hidden: true,
    };
  }
  /**
   * @param {object} msgData
   * @param {string} msgData.msg
   */
  requestAdmin(msgData, resp) {
    const cqnode = this[bindingCQNode];
    return false;
  }
  onGroupMessage(msgData, resp) {
    if (!msgData.atme) return false;
    return this.requestAdmin(msgData, resp);
  }
  onPrimaryMessage(msgData, resp) {
    return this.requestAdmin(msgData, resp);
  }
};
