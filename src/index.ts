import CQNodeRobot, { CQNodeConfig } from './cqnode-robot';
// import Plugin from './robot-plugin';
import * as eventType from './connector-oicq/event-type';
import { CQCode, segment } from './util';

export function createRobot(config: CQNodeConfig) {
  return new CQNodeRobot(config);
}
// export { default as Plugin } from './robot-plugin';
export const util = {
  eventType,
  CQCode,
  segment,
};

const CQNode = {
  createRobot,
  // Plugin,
  util,
};
CQNodeRobot.CQNode = CQNode;

export default CQNode;

export { default as MockClient } from './util/dev-connect/mock-client';
export { CQEventType, CQEvent } from './connector-oicq/event-type';
export type { FunctionModule } from './module';
export type { CQNodeEventContext } from './module/event-context';
