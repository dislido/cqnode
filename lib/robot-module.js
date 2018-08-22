const symbols = require('./symbols');

const { bindingCQNode, moduleSymbols } = symbols;
const { isRunning, onRun, onStop, svcList } = moduleSymbols;

module.exports = class CQNodeModule {
  constructor() {
    // this.inf = {};
    // this.command = {};
    this[isRunning] = false;
    this[bindingCQNode] = null;
    this.svcList = [];
  }
  onRun(/* CQNode */) {} // eslint-disable-line class-methods-use-this
  onStop() {} // eslint-disable-line class-methods-use-this
  onMessage(/* msgData, resp */) { // eslint-disable-line class-methods-use-this
    return false;
  }
  onGroupMessage(...args) {
    return this.onMessage(...args);
  }
  onPrivateMessage(...args) {
    return this.onMessage(...args);
  }
  /**
   * 注册模块服务
   * @param {string} svcName 服务名
   * @param {function} svcFunc 函数引用
   * @returns {boolean} 是否注册成功，服务名被占用时会返回false
   */
  registerSvc(svcName, svcFunc) {
    if (!this[isRunning]) throw new Error('在启动后才能注册服务 可以在onRun中注册');
    const isSuccess = this[bindingCQNode].moduleSvcManager.registerSvc(svcName, svcFunc);
    if (isSuccess) {
      this[svcList].push(svcFunc);
    }
    return isSuccess;
  }

  [onRun](CQNode) {
    this[isRunning] = true;
    this.onRun(CQNode);
  }
  [onStop]() {
    this.onStop();
    this[isRunning] = false;
    this[svcList].forEach(it => this[bindingCQNode].moduleSvcManager.removeSvc(it));
  }
};
