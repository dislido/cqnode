const symbols = require('./symbols');
const fs = require('fs');

const { bindingCQNode } = symbols;
const { isRunning, onRun, onStop, svcList } = symbols.CQNodeModule;

class CQNodeModule {
  constructor() {
    /*
      this.inf = {
        name: '',
        description: '',
        help: '',
        packageName: '',
        hidden: false,
      };
    */
    this[isRunning] = false;
    this[bindingCQNode] = null;
    this[svcList] = [];
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
    if (!this[isRunning]) throw new Error('在模块启动后才能使用(包括onRun和onStop)');
    const isSuccess = this[bindingCQNode].moduleSvcManager.registerSvc(svcName, svcFunc);
    if (isSuccess) {
      this[svcList].push(svcFunc);
    }
    return isSuccess;
  }

  getFilepath() {
    if (!this[isRunning]) throw new Error('在模块启动后才能使用(包括onRun和onStop)');
    const filepath = this[bindingCQNode].workpathManager.getWorkPath(`module/${this.inf.packageName}`);
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
    }
    return filepath;
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
}

CQNodeModule.symbols = {
  bindingCQNode,
  svcList,
  isRunning,
};

module.exports = CQNodeModule;
