import { ConfigObject, Robot, CQNodeOptions } from './types/robot';

export as namespace CQNode;

export * from './types/response';
export * from './types/cq-http';

export { Robot } from './types/robot';
export { Module } from './types/module';
export { Plugin, HookData } from './types/plugin';
export * from './types/util';
/**
 * 创建机器人
 * @param config 机器人配置
 */
export function createRobot(options?: CQNodeOptions, defaultConfig?: ConfigObject): Robot;