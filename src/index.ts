import Robot from './cqnode-robot';
import Module from './robot-module';
import registerEvent from './register-event';
import { CQNodeConfig } from './cqnode';
import ModuleFactory from './module-factory';


const CQNode = {
  createRobot(config: CQNodeConfig) {
    return new Robot(config);
  },
  Module: Module,
  ModuleFactory,
};

export default module.exports = CQNode;