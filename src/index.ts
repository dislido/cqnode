import CQNodeRobot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';
import * as CQNodeUtil from './cqnode-util';
import registerEvent from './register-event';
import { CQNodeConfig } from './cqnode';
import ModuleFactory from './module-factory';


const CQNode = {
  createRobot(config: CQNodeConfig) {
    const cqnode = new CQNodeRobot(config);
    cqnode.setMaxListeners(13);
    registerEvent(cqnode);
    return cqnode;
  },
  Module: Module,
  Plugin: Plugin,
  util: CQNodeUtil,
  ModuleFactory,
};

export default module.exports = CQNode;