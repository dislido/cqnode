import * as fs from 'fs';
import CQNodeRobot from './cqnode-robot';
import { CQNodeEventResponse, CQNodeModuleInf, EventReturns } from './cqnode';

export default abstract class CQNodeModule {
  bindingCQNode?: CQNodeRobot;
  isRunning = false;
  constructor(public inf: CQNodeModuleInf) {
  }
  onRun() {}
  onStop() {}
  onEvent(event: CQEvent.Event, resp: CQNodeEventResponse.Response): EventReturns {
    return false;
  }
  onMessage(data: CQEvent.MessageEvent, resp: CQNodeEventResponse.MessageResponse): EventReturns {
    return this.onEvent(data, resp);
  }
  onPrivateMessage(data: CQEvent.PrivateMessageEvent, resp: CQNodeEventResponse.PrivateMessageResponse): EventReturns {
    return this.onMessage(data, resp);
  }
  onGroupMessage(data: CQEvent.GroupMessageEvent, resp: CQNodeEventResponse.GroupMessageResponse): EventReturns {
    return this.onMessage(data, resp);
  }
  onDiscussMessage(data: CQEvent.DiscussMessageEvent, resp: CQNodeEventResponse.DiscussMessageResponse): EventReturns {
    return this.onMessage(data, resp);
  }
  onNotice(data: CQEvent.NoticeEvent, resp: CQNodeEventResponse.NoticeResponse): EventReturns {
    return this.onEvent(data, resp);
  }
  onGroupUploadNotice(data: CQEvent.GroupUploadNoticeEvent, resp: CQNodeEventResponse.GroupUploadNoticeResponse): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupAdminNotice(data: CQEvent.GroupAdminNoticeEvent, resp: CQNodeEventResponse.GroupAdminNoticeResponse): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupDecreaseNotice(data: CQEvent.GroupDecreaseNoticeEvent, resp: CQNodeEventResponse.GroupDecreaseNoticeResponse): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupIncreaseNotice(data: CQEvent.GroupIncreaseNoticeEvent, resp: CQNodeEventResponse.GroupIncreaseNoticeResponse): EventReturns {
    return this.onNotice(data, resp);
  }
  onFriendAddNotice(data: CQEvent.FriendAddNoticeEvent, resp: CQNodeEventResponse.FriendAddNoticeResponse): EventReturns {
    return this.onNotice(data, resp);
  }
  onRequest(data: CQEvent.RequestEvent, resp: CQNodeEventResponse.RequestResponse): EventReturns {
    return this.onEvent(data, resp);
  }
  onFriendRequest(data: CQEvent.FriendRequestEvent, resp: CQNodeEventResponse.FriendRequestResponse): EventReturns {
    return this.onRequest(data, resp);
  }
  onGroupRequest(data: CQEvent.GroupRequestEvent, resp: CQNodeEventResponse.GroupRequestResponse): EventReturns {
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
