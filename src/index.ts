import Robot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';
import * as eventType from './connector-oicq/event-type';
import { ConfigObject } from './cqnode-robot';
import { CQCode } from './util';

const CQNode = {
  createRobot(config: ConfigObject) {
    return new Robot(config);
  },
  Module,
  Plugin,
  util: {
    eventType,
    CQCode,
  },
};
Robot.CQNode = CQNode;

export default module.exports = CQNode;