import * as fs from 'fs';
import Robot from './cqnode-robot';
import { CQResponse } from '../types/response';
import { CQEvent } from '../types/cq-http';

type EventResult = boolean | void | CQResponse.Response;
export type EventReturns = EventResult | Promise<EventResult>;
/** 模块信息 */
export interface CQNodeModuleInf {
  /** 模块包名，应保证唯一，名称中不能包含无法作为文件名的字符，`/`会被替换为`.` */
  packageName?: string;
  /** 模块名 */
  name?: string;
  /** 模块帮助信息 */
  help?: string;
  /** 模块简介 */
  description?: string;
}

export default class CQNodeModule {
  cqnode?: Robot;
  isRunning = false;
  constructor(public inf: CQNodeModuleInf = {}) {
    if (this.inf.packageName) this.inf.packageName = this.inf.packageName.replace(/\//g, '.');
  }
  onRun() {}
  onStop() {}
  onEvent(event: CQEvent.Event, resp: CQResponse.Response): EventReturns {
    return false;
  }
  onMessage(data: CQEvent.Message, resp: CQResponse.Message): EventReturns {
    return this.onEvent(data, resp);
  }
  onPrivateMessage(data: CQEvent.PrivateMessage, resp: CQResponse.PrivateMessage): EventReturns {
    return this.onMessage(data, resp);
  }
  onGroupMessage(data: CQEvent.GroupMessage, resp: CQResponse.GroupMessage): EventReturns {
    return this.onMessage(data, resp);
  }
  onDiscussMessage(data: CQEvent.DiscussMessage, resp: CQResponse.DiscussMessage): EventReturns {
    return this.onMessage(data, resp);
  }
  onNotice(data: CQEvent.Notice, resp: CQResponse.Empty): EventReturns {
    return this.onEvent(data, resp);
  }
  onGroupUploadNotice(data: CQEvent.GroupUploadNotice, resp: CQResponse.Empty): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupAdminNotice(data: CQEvent.GroupAdminNotice, resp: CQResponse.Empty): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupDecreaseNotice(data: CQEvent.GroupDecreaseNotice, resp: CQResponse.Empty): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupIncreaseNotice(data: CQEvent.GroupIncreaseNotice, resp: CQResponse.Empty): EventReturns {
    return this.onNotice(data, resp);
  }
  onFriendAddNotice(data: CQEvent.FriendAddNotice, resp: CQResponse.Empty): EventReturns {
    return this.onNotice(data, resp);
  }
  onRequest(data: CQEvent.Request, resp: CQResponse.Request): EventReturns {
    return this.onEvent(data, resp);
  }
  onFriendRequest(data: CQEvent.FriendRequest, resp: CQResponse.FriendRequest): EventReturns {
    return this.onRequest(data, resp);
  }
  onGroupRequest(data: CQEvent.GroupRequest, resp: CQResponse.GroupRequest): EventReturns {
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
