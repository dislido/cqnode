import CQNodeRobot, { CQNodeConfig } from './cqnode-robot';
// import Plugin from './robot-plugin';
import * as eventType from './connector-oicq/event-type';
import { CQCode } from './util';

export function createRobot(config: CQNodeConfig) {
  return new CQNodeRobot(config);
}
// export { default as Plugin } from './robot-plugin';
export const util = {
  eventType,
  CQCode,
};

const CQNode = {
  createRobot,
  // Plugin,
  util: {
    CQCode,
  },
};
CQNodeRobot.CQNode = CQNode;

export { CQEventType, CQEvent } from './connector-oicq/event-type';
export type { FunctionModule } from './module';
