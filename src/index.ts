import CQNodeRobot from './cqnode-robot';
import Module from './robot-module';
import Plugin from './robot-plugin';

export module CQNode {
  export function createRobot(config: any) {
    return new CQNodeRobot(config);
  };
  export const Module = Module;
  export const Plugin = Plugin;
};