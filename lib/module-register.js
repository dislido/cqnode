const CQNodeModule = require('./robot-module');
const symbols = require('./symbols');

const { onRun, onStop, isRunning } = symbols.CQNodeModule;

const defaultFields = {
  inf: {},
  command: {},
  onRun(/* CQNode */) {},
  onStop() {},
  onMessage(/* msgData, resp */) {
    return false;
  },
  onGroupMessage(...args) {
    return this.onMessage(...args);
  },
  onPrivateMessage(...args) {
    return this.onMessage(...args);
  },
  [onRun](CQNode) {
    this.onRun(CQNode);
    this[isRunning] = true;
  },
  [onStop]() {
    this.onStop();
    this[isRunning] = false;
  },
  [isRunning]: false, // bug：所有模块共享了这个状态
};

function registerModule(mod) {
  if (!mod.inf || typeof mod.inf !== 'object') throw new Error('Module.inf is required');
  if (mod instanceof CQNodeModule) return mod;
  return new Proxy(mod, {
    get(target, name) {
      if (target[name]) return target[name];
      return defaultFields[name];
    },
  });
}

registerModule.symbols = {
  onRun,
  isRunning,
  onStop,
};

module.exports = registerModule;
