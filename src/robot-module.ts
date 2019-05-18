import * as fs from 'fs';
import CQNodeRobot from './cqnode-robot';
import { CQNodeEventResponse, CQNodeModuleInf, EventReturns } from './cqnode';

export default class CQNodeModule {
  bindingCQNode?: CQNodeRobot;
  isRunning = false;
  constructor(public inf: CQNodeModuleInf = {}) {
    if (this.inf.packageName) this.inf.packageName = this.inf.packageName.replace(/\//g, '.');
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
  onNotice(data: CQEvent.NoticeEvent, resp: CQNodeEventResponse.EmptyResponse): EventReturns {
    return this.onEvent(data, resp);
  }
  onGroupUploadNotice(data: CQEvent.GroupUploadNoticeEvent, resp: CQNodeEventResponse.EmptyResponse): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupAdminNotice(data: CQEvent.GroupAdminNoticeEvent, resp: CQNodeEventResponse.EmptyResponse): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupDecreaseNotice(data: CQEvent.GroupDecreaseNoticeEvent, resp: CQNodeEventResponse.EmptyResponse): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupIncreaseNotice(data: CQEvent.GroupIncreaseNoticeEvent, resp: CQNodeEventResponse.EmptyResponse): EventReturns {
    return this.onNotice(data, resp);
  }
  onFriendAddNotice(data: CQEvent.FriendAddNoticeEvent, resp: CQNodeEventResponse.EmptyResponse): EventReturns {
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

  /**
   * @todo 递归创建文件夹
   */
  getFilepath() {
    if (!this.bindingCQNode) throw new Error('在模块启动后才能使用(从onRun到onStop)');
    if (!this.inf.packageName) throw new Error('不能在匿名模块中使用此功能，在inf中添加packageName以启用此功能');
    const filepath = this.bindingCQNode.workpathManager.getWorkPath(`module/${this.inf.packageName}`);
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
    }
    return filepath;
  }
}
