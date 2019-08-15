import { CQResponse } from './response';
import { CQEvent } from './cq-http/events';
import { Robot } from './robot';

declare namespace Module {
  type EventResult = boolean | void | CQResponse.Response;
  type EventReturns = EventResult | Promise<EventResult>;
  /** 模块信息 */
  interface Inf {
    /** 模块包名，应保证唯一，名称中不能包含无法作为文件名的字符，`/`会被替换为`.` */
    packageName: string;
    /** 模块名 */
    name: string;
    /** 模块帮助信息 */
    help: string;
    /** 模块简介 */
    description: string;
  }
}

/** CQNode模块 */
declare class Module {
  /** 模块绑定的CQNode */
  cqnode: Robot;
  /** 模块是否处于运行状态 */
  isRunning: boolean;
  /** 模块信息 */
  inf: Module.Inf;

  constructor(inf?: Module.Inf);
  /** 模块启动 */
  onRun(): void;
  /** 模块停止 */
  onStop(): void;
  /** 收到事件 */
  onEvent(event: CQEvent.Event, resp: CQResponse.Response): Module.EventReturns;
  /** 收到消息 */
  onMessage(data: CQEvent.Message, resp: CQResponse.Message): Module.EventReturns;
  /** 收到私聊消息 */
  onPrivateMessage(data: CQEvent.PrivateMessage, resp: CQResponse.PrivateMessage): Module.EventReturns;
  /** 收到群消息 */
  onGroupMessage(data: CQEvent.GroupMessage, resp: CQResponse.GroupMessage): Module.EventReturns;
  /** 收到讨论组消息 */
  onDiscussMessage(data: CQEvent.DiscussMessage, resp: CQResponse.DiscussMessage): Module.EventReturns;
  /** 收到通知 */
  onNotice(data: CQEvent.Notice, resp: CQResponse.Notice): Module.EventReturns;
  /** 收到群文件上传通知 */
  onGroupUploadNotice(data: CQEvent.GroupUploadNotice, resp: CQResponse.GroupUploadNotice): Module.EventReturns;
  /** 收到群管理员变动通知 */
  onGroupAdminNotice(data: CQEvent.GroupAdminNotice, resp: CQResponse.GroupAdminNotice): Module.EventReturns;
  /** 收到群成员减少通知 */
  onGroupDecreaseNotice(data: CQEvent.GroupDecreaseNotice, resp: CQResponse.GroupDecreaseNotice): Module.EventReturns;
  /** 收到群成员增加通知 */
  onGroupIncreaseNotice(data: CQEvent.GroupIncreaseNotice, resp: CQResponse.GroupIncreaseNotice): Module.EventReturns;
  /** 收到好友添加通知 */
  onFriendAddNotice(data: CQEvent.FriendAddNotice, resp: CQResponse.FriendAddNotice): Module.EventReturns;
  /** 收到请求 */
  onRequest(data: CQEvent.Request, resp: CQResponse.Request): Module.EventReturns;
  /** 收到加好友请求 */
  onFriendRequest(data: CQEvent.FriendRequest, resp: CQResponse.FriendRequest): Module.EventReturns;
  /** 收到加群请求 */
  onGroupRequest(data: CQEvent.GroupRequest, resp: CQResponse.GroupRequest): Module.EventReturns;
  /** 获取本模块的数据文件目录 */
  getFilepath(): string;
}