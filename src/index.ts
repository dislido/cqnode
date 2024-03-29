import CQNodeRobot, { CQNodeConfig } from './cqnode-robot';
import * as ut from './util';

export * as oicq from 'oicq';

export async function createRobot(config: CQNodeConfig) {
  const robot = new CQNodeRobot(config);
  await robot.init();
  return robot;
}

export const util = ut;

const CQNode = {
  createRobot,
  util,
};
CQNodeRobot.CQNode = CQNode;

export default CQNode;

export { CQEventType, CQEvent } from './connector-oicq/event-type';
export { CQNodeHook } from './plugin/hook-processor';

export type { CQNodeConfig };
export type { FunctionModule, CQNodeEventContext } from './module';
export type { FunctionPlugin, CQNodeHookData } from './plugin';
export type { OICQAPI } from './connector-oicq/proxy-oicq-api';
