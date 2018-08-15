const onRun = Symbol('CQNodeModule.onRun');
const isRunning = Symbol('CQNodeModule.isRunning');
const onStop = Symbol('CQNodeModule.onStop');

module.exports = class CQNodeModule {
  constructor() {
    // this.inf = {};
    // this.command = {};
    this[isRunning] = false;
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
  [onRun](CQNode) {
    this.onRun(CQNode);
    this[isRunning] = true;
  }
  [onStop]() {
    this.onStop();
    this[isRunning] = false;
  }
};
