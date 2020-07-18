import Robot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';
import * as util from './util/common';
import { ConfigObject, CQNodeOptions } from '@/types/robot';

const CQNode = {
  createRobot(options: CQNodeOptions = {}, defaultConfig: ConfigObject = {}) {
    return new Robot(options, defaultConfig);
  },
  Module,
  Plugin,
  util,
};
Robot.CQNode = CQNode;

export = CQNode;
