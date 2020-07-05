import Robot from '../../cqnode-robot';
import { GroupConfig, CQNodeConfig } from '@/types/robot';
import { CQNodeRobotAPI } from '@/types/cqnode-robot-api';


export async function getConfig(this: CQNodeRobotAPI, groupId?: number): Promise<GroupConfig | CQNodeConfig> {
  if (groupId) {
    if (this.cqnode.groupConfig[groupId]) return this.cqnode.groupConfig[groupId];
    this.cqnode.groupConfig[groupId] = await this.cqnode.workpathManager.readJson(`group/${groupId}/config.json`) as GroupConfig;
    return this.cqnode.groupConfig[groupId];
  }

  return this.cqnode.config;
}

export async function setConfig(this: CQNodeRobotAPI, config: GroupConfig | CQNodeConfig, groupId?: number) {
  if (groupId) return this.cqnode.groupConfig.save(groupId, config as GroupConfig);
  return await this.cqnode.workpathManager.writeJson('config.json', this.cqnode.config);;
}
