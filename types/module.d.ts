import { CQResponse } from './response';
import { CQEvent } from './cq-http';
import { Robot } from './robot';
import { OptionalPromisify } from './type';

/** 模块信息 */
export interface CQNodeModuleInf {
  /** 模块包名，应保证唯一，名称中不能包含无法作为文件路径名的字符，建议同npm包名 */
  packageName?: string;
  /** 模块名 */
  name?: string;
  /** 模块帮助信息 */
  help?: string;
  /** 模块简介 */
  description?: string;
  [key: string]: any;
}

type EventResult = boolean | void | CQResponse.Response;
export type EventReturns = OptionalPromisify<EventResult>;

/** CQNode模块 */
export class Module {
  static Factory: typeof ModuleFactory;
  /** 模块绑定的CQNode，只在模块已启动的状态下允许使用 */
  cqnode: Robot;
  /** 模块是否处于运行状态 */
  isRunning: boolean;
  /** 模块信息 */
  inf: CQNodeModuleInf;

  constructor(inf?: CQNodeModuleInf);
  /** 模块启动 */
  onRun(): void;
  /** 模块停止 */
  onStop(): void;
  /** 收到事件 */
  onEvent(event: CQEvent.Event, resp: CQResponse.Response): EventReturns;
  /** 收到消息 */
  onMessage(data: CQEvent.Message, resp: CQResponse.Message): EventReturns;
  /** 收到私聊消息 */
  onPrivateMessage(data: CQEvent.PrivateMessage, resp: CQResponse.PrivateMessage): EventReturns;
  /** 收到群消息 */
  onGroupMessage(data: CQEvent.GroupMessage, resp: CQResponse.GroupMessage): EventReturns;
  /** 收到讨论组消息 */
  onDiscussMessage(data: CQEvent.DiscussMessage, resp: CQResponse.DiscussMessage): EventReturns;
  /** 收到通知 */
  onNotice(data: CQEvent.Notice, resp: CQResponse.Notice): EventReturns;
  /** 收到群文件上传通知 */
  onGroupUploadNotice(data: CQEvent.GroupUploadNotice, resp: CQResponse.GroupUploadNotice): EventReturns;
  /** 收到群管理员变动通知 */
  onGroupAdminNotice(data: CQEvent.GroupAdminNotice, resp: CQResponse.GroupAdminNotice): EventReturns;
  /** 收到群成员减少通知 */
  onGroupDecreaseNotice(data: CQEvent.GroupDecreaseNotice, resp: CQResponse.GroupDecreaseNotice): EventReturns;
  /** 收到群成员增加通知 */
  onGroupIncreaseNotice(data: CQEvent.GroupIncreaseNotice, resp: CQResponse.GroupIncreaseNotice): EventReturns;
  /** 收到好友添加通知 */
  onFriendAddNotice(data: CQEvent.FriendAddNotice, resp: CQResponse.FriendAddNotice): EventReturns;
  /** 收到请求 */
  onRequest(data: CQEvent.Request, resp: CQResponse.Request): EventReturns;
  /** 收到加好友请求 */
  onFriendRequest(data: CQEvent.FriendRequest, resp: CQResponse.FriendRequest): EventReturns;
  /** 收到加群请求 */
  onGroupRequest(data: CQEvent.GroupRequest, resp: CQResponse.GroupRequest): EventReturns;
  /** 获取本模块的数据文件目录 */
  getFilepath(): Promise<string>;
}

/** 创建模块 */
declare class ModuleFactory {
  constructor(config?: { noDuplicate?: boolean });
  /** 创建模块 */
  createConstructor(inf?: CQNodeModuleInf, initfn?: (...args: any) => void): typeof Module;
  /** 模块启动 */
  onRun(fn: (this: Module) => void): ModuleFactory;
  /** 模块停止 */
  onStop(fn: (this: Module) => void): ModuleFactory;
  /** 收到事件 */
  onEvent(fn: (this: Module, data: CQEvent.Event, resp: CQResponse.Response) => EventReturns): ModuleFactory;
  /** 收到消息 */
  onMessage(fn: (this: Module, data: CQEvent.Message, resp: CQResponse.Message) => EventReturns): ModuleFactory;
  /** 收到私聊消息 */
  onPrivateMessage(fn: (this: Module, data: CQEvent.PrivateMessage, resp: CQResponse.PrivateMessage) => EventReturns): ModuleFactory;
  /** 收到群消息 */
  onGroupMessage(fn: (this: Module, data: CQEvent.GroupMessage, resp: CQResponse.GroupMessage) => EventReturns): ModuleFactory;
  /** 收到讨论组消息 */
  onDiscussMessage(fn: (this: Module, data: CQEvent.DiscussMessage, resp: CQResponse.DiscussMessage) => EventReturns): ModuleFactory;
  /** 收到通知 */
  onNotice(fn: (this: Module, data: CQEvent.Notice, resp: CQResponse.Empty) => EventReturns): ModuleFactory;
  /** 收到群文件上传通知 */
  onGroupUploadNotice(fn: (this: Module, data: CQEvent.GroupUploadNotice, resp: CQResponse.Empty) => EventReturns): ModuleFactory;
  /** 收到群管理员变动通知 */
  onGroupAdminNotice(fn: (this: Module, data: CQEvent.GroupAdminNotice, resp: CQResponse.Empty) => EventReturns): ModuleFactory;
  /** 收到群成员减少通知 */
  onGroupDecreaseNotice(fn: (this: Module, data: CQEvent.GroupDecreaseNotice, resp: CQResponse.Empty) => EventReturns): ModuleFactory;
  /** 收到群成员增加通知 */
  onGroupIncreaseNotice(fn: (this: Module, data: CQEvent.GroupIncreaseNotice, resp: CQResponse.Empty) => EventReturns): ModuleFactory;
  /** 收到好友添加通知 */
  onFriendAddNotice(fn: (this: Module, data: CQEvent.FriendAddNotice, resp: CQResponse.Empty) => EventReturns): ModuleFactory;
  /** 收到请求 */
  onRequest(fn: (this: Module, data: CQEvent.Request, resp: CQResponse.Request) => EventReturns): ModuleFactory;
  /** 收到加好友请求 */
  onFriendRequest(fn: (this: Module, data: CQEvent.FriendRequest, resp: CQResponse.FriendRequest) => EventReturns): ModuleFactory;
  /** 收到加群请求 */
  onGroupRequest(fn: (this: Module, data: CQEvent.GroupRequest, resp: CQResponse.GroupRequest) => EventReturns): ModuleFactory;
}
