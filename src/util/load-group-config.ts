import Robot from '../cqnode-robot';
import { CQHTTP } from '@/types/cq-http';
import { GroupConfig } from '@/types/robot';

export function loadGroupConfig(this: Robot, groupList: CQHTTP.GetGroupListResponseData) {
  const promises = groupList.map(async ({ group_id: groupId }) => this.workpath.getJsonStorage<GroupConfig>(`group/${groupId}/config.json`, {}).then(storage => {
    this.groupConfig[groupId] = storage;
  }));

  return Promise.all(promises);
}