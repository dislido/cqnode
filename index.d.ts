import { ConfigObject, Robot } from './types/robot';

export as namespace CQNode;

export * from './types/response';
export * from './types/cq-http';

export * from './types/module';
export * from './types/util';
export * from './types/plugin';
/**
 * 创建机器人
 * @param config 机器人配置
 */
export function createRobot(config: ConfigObject): Robot;