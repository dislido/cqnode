import CQNodeRobot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';
import registerEvent from './register-event'
module.exports = {
  createRobot(config: any) {
    const cqnode = new CQNodeRobot(config);
    cqnode.setMaxListeners(17);
    registerEvent(cqnode);
    return cqnode;
  },
  Module: Module,
  Plugin: Plugin,
};

export default module.exports;