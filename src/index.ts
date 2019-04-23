import CQNodeRobot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';
import registerEvent from './register-event';

const CQNode = {
  createRobot(config: any) {
    const cqnode = new CQNodeRobot(config);
    cqnode.setMaxListeners(17);
    registerEvent(cqnode);
    return cqnode;
  },
  Module: Module,
  Plugin: Plugin,
};
module.exports = CQNode;

export default CQNode;