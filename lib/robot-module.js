const symbols = require('./symbols');
const fs = require('fs');

const { bindingCQNode } = symbols;
const { isRunning, onRun, onStop, svcList } = symbols.CQNodeModule;
/**
 * @property {Object} symbols
 * @property {Symbol} symbols.bindingCQNode
 * @property {Symbol} symbols.svcList
 * @property {Symbol} symbols.isRunning
 */
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
  onRun() {} // eslint-disable-line class-methods-use-this
  onStop() {} // eslint-disable-line class-methods-use-this
  onMessage(/* msgData, resp */) { // eslint-disable-line class-methods-use-this
    return false;
  }
  onGroupMessage(...args) {
    return this.onMessage(...args);
  }
  onGroupNotice(...args) { // eslint-disable-line class-methods-use-this
    return false;
  }
  onPrivateMessage(...args) {
    return this.onMessage(...args);
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
    this[bindingCQNode] = CQNode;
    this[isRunning] = true;
    this.onRun();
  }
  [onStop]() {
    this.onStop();
    this[bindingCQNode] = null;
    this[isRunning] = false;
  }
}

CQNodeModule.symbols = {
  bindingCQNode,
  svcList,
  isRunning,
};


module.exports = CQNodeModule;
