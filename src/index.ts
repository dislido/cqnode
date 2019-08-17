import Robot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';
import ModuleFactory from './module-factory';
import * as eventType from './connector-cqhttp/event-type';
import ConfigObject from './cqnode-robot';

const CQNode = {
  createRobot(config: ConfigObject) {
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