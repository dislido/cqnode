import Robot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';
import { ConfigObject } from './cqnode-robot';
import * as util from './util/common';

const CQNode = {
  createRobot(config: ConfigObject) {
    return new Robot(config);
  },
  Module,
  Plugin,
  util,
};
Robot.CQNode = CQNode;

export default module.exports = CQNode;