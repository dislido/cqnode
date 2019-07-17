import Robot from './cqnode-robot';
import Module from './robot-module';
import registerEvent from './register-event';
import { CQNodeConfig } from './cqnode';
import ModuleFactory from './module-factory';


const CQNode = {
  createRobot(config: CQNodeConfig) {
    const cqnode = new Robot(config);
    cqnode.setMaxListeners(13);
    registerEvent(cqnode);
    return cqnode;
  },
  Module: Module,
  ModuleFactory,
};

export default module.exports = CQNode;