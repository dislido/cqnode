import CQNodeRobot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';
import registerEvent from './register-event';
import { CQNodeConfig } from './cqnode';

const CQNode = {
  createRobot(config: CQNodeConfig) {
    const cqnode = new CQNodeRobot(config);
    cqnode.setMaxListeners(13);
    registerEvent(cqnode);
    return cqnode;
  },
  Module: Module,
  Plugin: Plugin,
};
module.exports = CQNode;

export default CQNode;