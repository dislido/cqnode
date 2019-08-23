import Robot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';
import * as eventType from './connector-cqhttp/event-type';
import ConfigObject from './cqnode-robot';
import { parseCQCodeString } from './util';

const CQNode = {
  createRobot(config: ConfigObject) {
    return new Robot(config);
  },
  Module,
  Plugin,
  util: {
    eventType,
    CQCode: {
      parseString: parseCQCodeString,
    },
  },
};

export default module.exports = CQNode;