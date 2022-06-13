import CQNodeRobot, { CQNodeConfig } from './cqnode-robot';
import * as eventType from './connector-oicq/event-type';
import { CQCode, segment } from './util';

export function createRobot(config: CQNodeConfig) {
  return new CQNodeRobot(config);
}

export const util = {
  eventType,
  CQCode,
  segment,
};

const CQNode = {
  createRobot,
  util,
};
CQNodeRobot.CQNode = CQNode;

export default CQNode;

export { CQEventType, CQEvent } from './connector-oicq/event-type';
export { CQNodeHook } from './plugin/hook-processor';

export type { FunctionModule } from './module';
export type { FunctionPlugin } from './plugin';
export type { CQNodeEventContext } from './module/event-context';
