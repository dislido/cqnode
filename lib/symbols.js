const symbols = {
  bindingCQNode: Symbol('CQNodeModule.bindingCQNode'),
  CQNodeModule: {
    onRun: Symbol('CQNodeModule.onRun'),
    isRunning: Symbol('CQNodeModule.isRunning'),
    onStop: Symbol('CQNodeModule.onStop'),
    svcList: Symbol('CQNodeModule.svcList'),
  },
};

module.exports = symbols;
