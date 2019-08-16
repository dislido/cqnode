import { Module } from './module';
import { CQEvent } from './cq-http';
import { CQResponse } from './response';

/** 创建模块 */
export class ModuleFactory {
  constructor(config?: { noDuplicate: boolean });
  /** 创建模块 */
  createConstructor(inf?: Module.Inf, initfn?: (...args: any) => void): typeof Module;
  /** 模块启动 */
  onRun(fn: (this: Module) => void): ModuleFactory;
  /** 模块停止 */
  onStop(fn: (this: Module) => void): ModuleFactory;
  /** 收到事件 */
  onEvent(fn: (this: Module, data: CQEvent.Event, resp: CQResponse.Response) => Module.EventReturns): ModuleFactory;
  /** 收到消息 */
  onMessage(fn: (this: Module, data: CQEvent.Message, resp: CQResponse.Message) => Module.EventReturns): ModuleFactory;
  /** 收到私聊消息 */
  onPrivateMessage(fn: (this: Module, data: CQEvent.PrivateMessage, resp: CQResponse.PrivateMessage) => Module.EventReturns): ModuleFactory;
  /** 收到群消息 */
  onGroupMessage(fn: (this: Module, data: CQEvent.GroupMessage, resp: CQResponse.GroupMessage) => Module.EventReturns): ModuleFactory;
  /** 收到讨论组消息 */
  onDiscussMessage(fn: (this: Module, data: CQEvent.DiscussMessage, resp: CQResponse.DiscussMessage) => Module.EventReturns): ModuleFactory;
  /** 收到通知 */
  onNotice(fn: (this: Module, data: CQEvent.Notice, resp: CQResponse.Empty) => Module.EventReturns): ModuleFactory;
  /** 收到群文件上传通知 */
  onGroupUploadNotice(fn: (this: Module, data: CQEvent.GroupUploadNotice, resp: CQResponse.Empty) => Module.EventReturns): ModuleFactory;
  /** 收到群管理员变动通知 */
  onGroupAdminNotice(fn: (this: Module, data: CQEvent.GroupAdminNotice, resp: CQResponse.Empty) => Module.EventReturns): ModuleFactory;
  /** 收到群成员减少通知 */
  onGroupDecreaseNotice(fn: (this: Module, data: CQEvent.GroupDecreaseNotice, resp: CQResponse.Empty) => Module.EventReturns): ModuleFactory;
  /** 收到群成员增加通知 */
  onGroupIncreaseNotice(fn: (this: Module, data: CQEvent.GroupIncreaseNotice, resp: CQResponse.Empty) => Module.EventReturns): ModuleFactory;
  /** 收到好友添加通知 */
  onFriendAddNotice(fn: (this: Module, data: CQEvent.FriendAddNotice, resp: CQResponse.Empty) => Module.EventReturns): ModuleFactory;
  /** 收到请求 */
  onRequest(fn: (this: Module, data: CQEvent.Request, resp: CQResponse.Request) => Module.EventReturns): ModuleFactory;
  /** 收到加好友请求 */
  onFriendRequest(fn: (this: Module, data: CQEvent.FriendRequest, resp: CQResponse.FriendRequest) => Module.EventReturns): ModuleFactory;
  /** 收到加群请求 */
  onGroupRequest(fn: (this: Module, data: CQEvent.GroupRequest, resp: CQResponse.GroupRequest) => Module.EventReturns): ModuleFactory;
}