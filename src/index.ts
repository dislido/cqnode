import Robot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';
import * as util from './util/common';
import { ConfigObject } from '@/types/robot';

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