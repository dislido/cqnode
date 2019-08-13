import Robot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';
import { CQNodeConfig } from './cqnode';
import ModuleFactory from './module-factory';
import * as eventType from './connector-cqhttp/event-type';

const CQNode = {
  createRobot(config: CQNodeConfig) {
    return new Robot(config);
  },
  Module,
  Plugin,
  ModuleFactory,
  util: {
    eventType,
  },
};

export default module.exports = CQNode;