import CQNodeRobot, { CQNodeConfig } from './cqnode-robot';
import { segment } from './util';

export function createRobot(config: CQNodeConfig) {
  return new CQNodeRobot(config);
}

export const util = {
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

export type { CQNodeConfig };
export type { FunctionModule } from './module';
export type { FunctionPlugin } from './plugin';
export type { CQNodeEventContext } from './module/event-context';
