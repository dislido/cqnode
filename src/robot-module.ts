import * as fs from 'fs';
import CQNodeRobot from './cqnode-robot';
import { CQNodeEventResponse, CQNodeModuleInf, EventResult } from './cqnode';

export default abstract class CQNodeModule {
  bindingCQNode?: CQNodeRobot;
  isRunning = false;
  constructor(public inf: CQNodeModuleInf) {
  }
  onRun() {}
  onStop() {}
  onEvent(event: CQEvent.Event, resp: CQNodeEventResponse.Response): EventResult {
    return false;
  }
  onMessage(data: CQEvent.MessageEvent, resp: CQNodeEventResponse.MessageResponse): EventResult {
    return this.onEvent(data, resp);
  }
  onPrivateMessage(data: CQEvent.PrivateMessageEvent, resp: CQNodeEventResponse.PrivateMessageResponse): EventResult {
    return this.onMessage(data, resp);
  }
  onGroupMessage(data: CQEvent.GroupMessageEvent, resp: CQNodeEventResponse.GroupMessageResponse): EventResult {
    return this.onMessage(data, resp);
  }
  onDiscussMessage(data: CQEvent.DiscussMessageEvent, resp: CQNodeEventResponse.DiscussMessageResponse): EventResult {
    return this.onMessage(data, resp);
  }
  onNotice(data: CQEvent.NoticeEvent, resp: CQNodeEventResponse.NoticeResponse): EventResult {
    return this.onEvent(data, resp);
  }
  onGroupUploadNotice(data: CQEvent.GroupUploadNoticeEvent, resp: CQNodeEventResponse.GroupUploadNoticeResponse): EventResult {
    return this.onNotice(data, resp);
  }
  onGroupAdminNotice(data: CQEvent.GroupAdminNoticeEvent, resp: CQNodeEventResponse.GroupAdminNoticeResponse): EventResult {
    return this.onNotice(data, resp);
  }
  onGroupDecreaseNotice(data: CQEvent.GroupDecreaseNoticeEvent, resp: CQNodeEventResponse.GroupDecreaseNoticeResponse): EventResult {
    return this.onNotice(data, resp);
  }
  onGroupIncreaseNotice(data: CQEvent.GroupIncreaseNoticeEvent, resp: CQNodeEventResponse.GroupIncreaseNoticeResponse): EventResult {
    return this.onNotice(data, resp);
  }
  onFriendAddNotice(data: CQEvent.FriendAddNoticeEvent, resp: CQNodeEventResponse.FriendAddNoticeResponse): EventResult {
    return this.onNotice(data, resp);
  }
  onRequest(data: CQEvent.RequestEvent, resp: CQNodeEventResponse.RequestResponse): EventResult {
    return this.onEvent(data, resp);
  }
  onFriendRequest(data: CQEvent.FriendRequestEvent, resp: CQNodeEventResponse.FriendRequestResponse): EventResult {
    return this.onRequest(data, resp);
  }
  onGroupRequest(data: CQEvent.GroupRequestEvent, resp: CQNodeEventResponse.GroupRequestResponse): EventResult {
    return this.onRequest(data, resp);
  }

  getFilepath() {
    if (!this.bindingCQNode) throw new Error('在模块启动后才能使用(包括onRun和onStop)');
    const filepath = this.bindingCQNode.workpathManager.getWorkPath(`module/${this.inf.packageName}`);
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
    }
    return filepath;
  }

  /**
   * @todo 移动到CQNodeRobot
   */
  // [onStop]() {
  //   this.onStop();
  //   this[bindingCQNode] = null;
  //   this[isRunning] = false;
  // }
}
