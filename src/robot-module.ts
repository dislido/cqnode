import * as fs from 'fs';
import { CQEvent } from '../types/cq-http';
import { Module } from '../types/module';
import { CQResponse } from '../types/response';
import { Robot } from '../types/robot';

export default class CQNodeModule {
  cqnode?: Robot;
  isRunning = false;
  constructor(public inf: Module.Inf = {}) {
    if (this.inf.packageName) this.inf.packageName = this.inf.packageName.replace(/\//g, '.');
  }
  onRun() {}
  onStop() {}
  onEvent(event: CQEvent.Event, resp: CQResponse.Response): Module.EventReturns {
    return false;
  }
  onMessage(data: CQEvent.Message, resp: CQResponse.Message): Module.EventReturns {
    return this.onEvent(data, resp);
  }
  onPrivateMessage(data: CQEvent.PrivateMessage, resp: CQResponse.PrivateMessage): Module.EventReturns {
    return this.onMessage(data, resp);
  }
  onGroupMessage(data: CQEvent.GroupMessage, resp: CQResponse.GroupMessage): Module.EventReturns {
    return this.onMessage(data, resp);
  }
  onDiscussMessage(data: CQEvent.DiscussMessage, resp: CQResponse.DiscussMessage): Module.EventReturns {
    return this.onMessage(data, resp);
  }
  onNotice(data: CQEvent.Notice, resp: CQResponse.Empty): Module.EventReturns {
    return this.onEvent(data, resp);
  }
  onGroupUploadNotice(data: CQEvent.GroupUploadNotice, resp: CQResponse.Empty): Module.EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupAdminNotice(data: CQEvent.GroupAdminNotice, resp: CQResponse.Empty): Module.EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupDecreaseNotice(data: CQEvent.GroupDecreaseNotice, resp: CQResponse.Empty): Module.EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupIncreaseNotice(data: CQEvent.GroupIncreaseNotice, resp: CQResponse.Empty): Module.EventReturns {
    return this.onNotice(data, resp);
  }
  onFriendAddNotice(data: CQEvent.FriendAddNotice, resp: CQResponse.Empty): Module.EventReturns {
    return this.onNotice(data, resp);
  }
  onRequest(data: CQEvent.Request, resp: CQResponse.Request): Module.EventReturns {
    return this.onEvent(data, resp);
  }
  onFriendRequest(data: CQEvent.FriendRequest, resp: CQResponse.FriendRequest): Module.EventReturns {
    return this.onRequest(data, resp);
  }
  onGroupRequest(data: CQEvent.GroupRequest, resp: CQResponse.GroupRequest): Module.EventReturns {
    return this.onRequest(data, resp);
  }

  /**
   * @todo 递归创建文件夹
   */
  getFilepath() {
    if (!this.cqnode) throw new Error('在模块启动后才能使用(从onRun到onStop)');
    if (!this.inf.packageName) throw new Error('不能在匿名模块中使用此功能，在inf中添加packageName以启用此功能');
    const filepath = this.cqnode.workpathManager.getWorkPath(`module/${this.inf.packageName}`);
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
    }
    return filepath;
  }
}
