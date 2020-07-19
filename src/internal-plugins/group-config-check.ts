import CQNodePlugin from "../robot-plugin";
import { HookData } from "@/types/plugin";
import { eventType } from "../util";
import { loadGroupConfig } from "../util/load-group-config";

export = class GroupConfigCheck extends CQNodePlugin {
  onEventReceived(data: HookData.onEventReceived) {
    if (!eventType.isGroupEvent(data.event)) return true;
    const { groupId } = data.event;
    if (!this.cqnode.groupConfig.get(groupId) || !this.cqnode.inf.groupList.some(group => group.group_id === groupId)) {
      loadGroupConfig.call(this.cqnode, [{ group_id: groupId }]);
      this.cqnode.api.getGroupList
      return false;
    }
    return data;
  }
}
