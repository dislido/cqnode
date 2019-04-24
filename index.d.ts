export as namespace CQNode;
import { ServerResponse } from 'http';

interface CQNodeRobot {
  api: {
    /**
     * 发送私聊消息  
     * @param userId 对方QQ号
     * @param message 要发送的内容
     * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
      */
    sendPrivateMsg: (userId: number, message: string, autoEscape: boolean) => Promise<number>;
  }
}

export function createRobot(config: any): CQNodeRobot;

/** 模块信息 */
interface CQNodeModuleInf {
  /** 模块包名，应保证唯一 */
  packageName: string;
  /** 模块名 */
  name: string;
  /** 模块帮助信息 */
  help: string;
  /** 模块简介 */
  description: string;
}

type EventResult = boolean | undefined | CQNodeEventResponse.Response;
type EventReturns = EventResult | Promise<EventResult>;
export abstract class Module {
  /** 模块绑定的CQNode */
  bindingCQNode: CQNodeRobot;
  /** 模块是否处于运行状态 */
  isRunning: boolean;
  /** 模块信息 */
  inf: CQNodeModuleInf;

  constructor(inf: CQNodeModuleInf);
  /** 模块启动 */
  onRun(): void;
  /** 模块停止 */
  onStop(): void;
  /** 收到事件 */
  onEvent(event: CQEvent.Event, resp: CQNodeEventResponse.Response): EventReturns;
  /** 收到消息 */
  onMessage(data: CQEvent.MessageEvent, resp: CQNodeEventResponse.MessageResponse): EventReturns;
  /** 收到私聊消息 */
  onPrivateMessage(data: CQEvent.PrivateMessageEvent, resp: CQNodeEventResponse.PrivateMessageResponse): EventReturns;
  /** 收到群消息 */
  onGroupMessage(data: CQEvent.GroupMessageEvent, resp: CQNodeEventResponse.GroupMessageResponse): EventReturns;
  /** 收到讨论组消息 */
  onDiscussMessage(data: CQEvent.DiscussMessageEvent, resp: CQNodeEventResponse.DiscussMessageResponse): EventReturns;
  /** 收到通知 */
  onNotice(data: CQEvent.NoticeEvent, resp: CQNodeEventResponse.NoticeResponse): EventReturns;
  /** 收到群文件上传通知 */
  onGroupUploadNotice(data: CQEvent.GroupUploadNoticeEvent, resp: CQNodeEventResponse.GroupUploadNoticeResponse): EventReturns;
  /** 收到群管理员变动通知 */
  onGroupAdminNotice(data: CQEvent.GroupAdminNoticeEvent, resp: CQNodeEventResponse.GroupAdminNoticeResponse): EventReturns;
  /** 收到群成员减少通知 */
  onGroupDecreaseNotice(data: CQEvent.GroupDecreaseNoticeEvent, resp: CQNodeEventResponse.GroupDecreaseNoticeResponse): EventReturns;
  /** 收到群成员增加通知 */
  onGroupIncreaseNotice(data: CQEvent.GroupIncreaseNoticeEvent, resp: CQNodeEventResponse.GroupIncreaseNoticeResponse): EventReturns;
  /** 收到好友添加通知 */
  onFriendAddNotice(data: CQEvent.FriendAddNoticeEvent, resp: CQNodeEventResponse.FriendAddNoticeResponse): EventReturns;
  /** 收到请求 */
  onRequest(data: CQEvent.RequestEvent, resp: CQNodeEventResponse.RequestResponse): EventReturns;
  /** 收到加好友请求 */
  onFriendRequest(data: CQEvent.FriendRequestEvent, resp: CQNodeEventResponse.FriendRequestResponse): EventReturns;
  /** 收到加群请求 */
  onGroupRequest(data: CQEvent.GroupRequestEvent, resp: CQNodeEventResponse.GroupRequestResponse): EventReturns;
  /** 获取本模块的数据文件目录 */
  getFilepath(): string;
}

/** CQNode事件响应对象 */
export namespace CQNodeEventResponse {
  /** CQNode事件响应对象 */
  interface Response {
    /** 原始http response对象，通常情况下不建议直接调用此对象 */
    originalResponse: ServerResponse;
    /** response响应数据，通常情况下不建议直接修改此对象内容， */
    responseBody: {
      [field: string]: any;
    };
  }

  /** 消息类事件 */
  interface MessageResponse extends Response {
    /**
     * 向消息来源私聊/群/讨论组发送消息，不使用response而是使用API发送消息
     * @param message 回复信息
     * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码）
     */
    send(message: string, autoEscape?: boolean): void;
    /**
     * 使用response响应回复消息
     * @param message 回复信息
     * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码）
     */
    reply(message: string, autoEscape?: boolean): this;
  }

  /** 私聊消息事件 */
  interface PrivateMessageResponse extends MessageResponse {}

  /** 群消息事件 */
  interface GroupMessageResponse extends MessageResponse {
    /**
     * 向发送者发送私聊消息
     * @param message 回复信息
     * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码）
     */
    sendPrivate(message: string, autoEscape?: boolean): void;
    /** 是否要在回复开头at发送者，发送者是匿名用户时无效 */
    at(at: boolean): this;
    /** 撤回该消息 */
    delete(): this;
    /** 把发送者踢出群组（需要登录号权限足够），不拒绝此人后续加群请求，发送者是匿名用户时无效 */
    kick(): this;
    /**
     * 把发送者禁言，对匿名用户也有效
     * @param duration 指定时长（分钟）
     */
    ban(duration: number): this;
  }

  /** 讨论组消息事件 */
  interface DiscussMessageResponse extends MessageResponse {
    /** 是否要在回复开头at发送者 */
    at(at: boolean): this;
  }

  /** 通知类事件 */
  interface NoticeResponse extends Response {
    /**
     * 向通知来源私聊/群/讨论组发送消息
     * @param message 回复信息
     */
    send(message: string): this;
  }

  /** 群文件上传 */
  interface GroupUploadNoticeResponse extends NoticeResponse {}

  /** 群管理员变动 */
  interface GroupAdminNoticeResponse extends NoticeResponse {}

  /** 群成员减少 */
  interface GroupDecreaseNoticeResponse extends NoticeResponse {}

  /** 群成员增加 */
  interface GroupIncreaseNoticeResponse extends NoticeResponse {}

  /** 好友添加 */
  interface FriendAddNoticeResponse extends NoticeResponse {}

  /** 请求类事件 */
  interface RequestResponse extends Response {}

  /** 加好友请求 */
  interface FriendRequestResponse extends RequestResponse {
    /**
     * 是否同意请求
     * @param approve 是否同意请求
     * @param remark 添加后的好友备注（仅在approve=true时有效）
     */
    approve(approve: boolean, remark?: string): this;
  }

  /** 加群请求 */
  interface GroupRequestResponse extends RequestResponse {
    /**
     * 是否同意请求
     * @param approve 是否同意请求/邀请
     * @param reason 拒绝理由（仅在拒绝时有效）
     */
    approve(approve: boolean, reason?: string): this;
  }

  /** 元事件 */
  interface MetaResponse extends Response {}

  /** 生命周期 */
  interface LifecycleMetaResponse extends MetaResponse {}
  
  /** 心跳 */
  interface HeartbeatMetaResponse extends MetaResponse {}
}

/** CQHTTP上报事件 */
export namespace CQEvent {
  /** CQHTTP上报事件 */
  interface Event {
    /** 上报类型  
     * message: 收到消息  
     * notice: 群、讨论组变动等通知类事件  
     * request: 加好友请求、加群请求／邀请  
     * meta_event: 元事件
     */
    postType: 'message' | 'notice' | 'request' | 'meta_event';
    /** 事件发生的时间戳 */
    time: number;
    /** 收到消息的机器人 QQ 号 */
    selfId: number;
  }

  /** 消息类事件 */
  interface MessageEvent extends Event {
    postType: 'message';
    /** 消息类型  
     * group: 群消息  
     * private: 私聊消息  
     * discuss: 讨论组消息
     */
    messageType: 'group' | 'private' | 'discuss';
    /** 消息 ID */
    messageId: number;
    /** 发送者 QQ 号 */
    userId: number;
    /** 消息内容 */
    message: string;
    /** 原始消息内容 */
    rawMessage: string;
    /** 字体 */
    font: number;
    /** 发送人信息,不保证各字段存在和正确性 */
    sender: {
      [field: string]: any;
    },
    /** cqnode附加字段：发送人名称，会尽可能提供在聊天窗口显示的名称 */
    username: string;
    /** cqnode附加字段：是否at了本账号，私聊消息中总是为true */
    atme: boolean;
    /**
     * cqnode附加字段：对message进行过预处理操作后的字符串
     * (进行trim操作，移除at信息部分)
     */
    msg: string;
  }

  /** 私聊消息事件 */
  interface PrivateMessageEvent extends MessageEvent {
    messageType: 'private';
    /** 消息子类型，表示私聊的来源  
     * friend: 好友  
     * group: 群临时会话
     * discuss: 讨论组临时会话  
     * other: 其他
     */
    subType: 'friend' | 'group' | 'discuss' | 'other';
    /** 发送人信息,不保证各字段存在和正确性 */
    sender: {
      /** 发送者 QQ 号 */
      userId: number;
      /** 昵称 */
      nickname: string;
      /** 性别 */
      sex: 'male' | 'female' | 'unknown';
      /** 年龄 */
      age: number;
    }
  }

  /** 群消息事件 */
  interface GroupMessageEvent extends MessageEvent {
    messageType: 'group';
    /** 消息子类型  
     * normal: 正常消息  
     * anonymous: 匿名消息  
     * notice: 系统提示
     */
    subType: 'normal' | 'anonymous' | 'notice';
    /** 群号 */
    groupId: number;
    /** 匿名信息，如果不是匿名消息则为 null */
    anonymous: null | {
      /** 匿名用户ID */
      id: number;
      /** 匿名用户名称 */
      name: string;
      /** 匿名用户flag，在调用禁言API时需要传入 */
      flag: string;
    };
    /** 发送人信息,不保证各字段存在和正确性 */
    sender: {
      /** 发送者QQ号 */
      userId: number
      /** 年龄 */
      age: number;
      /** 地区 */
      area: string;
      /** 群名片／备注 */
      card: string;
      /** 成员等级 */
      level: string;
      /** 昵称 */
      nickname: string;
      /** 角色  
       * owner: 群主  
       * admin: 管理员  
       * member: 群成员
       */
      role: 'owner' | 'admin' | 'member';
      /** 性别 */
      sex: 'male' | 'female' | 'unknown';
      /** 专属头衔 */
      title: string;
    };
  }

  /** 讨论组消息事件 */
  interface DiscussMessageEvent extends MessageEvent {
    messageType: 'discuss';
    /** 讨论组ID */
    discussId: number;
    /** 发送人信息,不保证各字段存在和正确性 */
    sender: {
      /** 发送者 QQ 号 */
      userId: number;
      /** 昵称 */
      nickname: string;
      /** 性别 */
      sex: 'male' | 'female' | 'unknown';
      /** 年龄 */
      age: number;
    }
  }

  /** 通知类事件 */
  interface NoticeEvent extends Event {
    postType: 'notice';
    /** 通知类型  
     * group_upload: 群文件上传  
     * group_admin: 群管理员变动  
     * group_decrease: 群成员减少  
     * group_increase: 群成员增加  
     * friend_add: 好友添加
     */
    noticeType: 'group_upload' | 'group_admin' | 'group_decrease' | 'group_increase' | 'friend_add';
  }

  /** 群文件上传 */
  interface GroupUploadNoticeEvent extends NoticeEvent {
    noticeType: 'group_upload';
    /** 群号 */
    groupId: number;
    /** 发送者QQ号 */
    userId: number;
    /** 文件信息 */
    file: {
      /** 文件ID */
      id: string;
      /** 文件名 */
      name: string;
      /** 文件大小（字节） */
      size: number;
      /** 未知用途 */
      busid: number;
    }
  }

  /** 群管理员变动 */
  interface GroupAdminNoticeEvent extends NoticeEvent {
    noticeType: 'group_admin';
    /** 子类型  
     * set: 设置管理员  
     * unset: 取消管理员
     */
    subType: 'set' | 'unset';
    /** 群号 */
    groupId: number;
    /** 管理员QQ号 */
    userId: number;
  }

  /** 群成员减少 */
  interface GroupDecreaseNoticeEvent extends NoticeEvent {
    noticeType: 'group_decrease';
    /** 子类型
     * leave: 主动退群
     * kick: 被踢出群
     * kick_me: 本账号被踢出群
     */
    subType: 'leave' | 'kick' | 'kick_me';
    /** 群号 */
    groupId: number;
    /** 操作者 QQ 号（如果是主动退群，则和 userId 相同） */
    operatorId: number;
    /** 离开者 QQ 号 */
    userId: number;
  }

  /** 群成员增加 */
  interface GroupIncreaseNoticeEvent extends NoticeEvent {
    noticeType: 'group_increase';
    /** 子类型
     * approve: 管理员已同意入群
     * invite: 管理员邀请入群
     */
    subType: 'approve' | 'invite';
    /** 群号 */
    groupId: number;
    /** 操作者 QQ 号 */
    operatorId: number;
    /** 加入者 QQ 号 */
    userId: number;
  }

  /** 好友添加 */
  interface FriendAddNoticeEvent extends NoticeEvent {
    noticeType: 'friend_add';
    /** 新添加好友 QQ 号 */
    userId: number;
  }

  /** 请求类事件 */
  interface RequestEvent extends Event {
    postType: 'request';
    /** 请求类型  
     * friend: 加好友请求  
     * group: 加群请求/邀请
     */
    requestType: 'friend' | 'group';
  }

  /** 加好友请求 */
  interface FriendRequestEvent extends RequestEvent {
    requestType: 'friend';
    /** 发送请求的 QQ 号 */
    userId: number;
    /** 验证信息 */
    comment: string;
    /** 请求 flag，在调用处理请求的 API 时需要传入 */
    flag: string;
  }

  /** 加群请求 */
  interface GroupRequestEvent extends RequestEvent {
    requestType: 'group';
    /** 子类型  
     * add: 请求加群  
     * invite: 邀请本账号入群
     */
    subType: 'add' | 'invite';
    /** 群号 */
    groupId: number;
    /** 发送请求的 QQ 号 */
    userId: number;
    /** 验证信息 */
    comment: string;
    /** 请求 flag，在调用处理请求的 API 时需要传入 */
    flag: string;
  }

  /** 元事件 */
  interface MetaEvent extends Event {
    postType: 'meta_event';
    /** 元事件类型  
     * lifecycle: 生命周期  
     * heartbeat: 心跳
     */
    metaEventType: 'lifecycle' | 'heartbeat';
  }

  /** 生命周期 */
  interface LifecycleMetaEvent extends MetaEvent {
    metaEventType: 'lifecycle';
    /** 子类型  
     * enable: 插件启用  
     * disable: 插件停用
     */
    subType: 'enable' | 'disable';
  }
  
  /** 心跳 */
  interface HeartbeatMetaEvent extends MetaEvent {
    metaEventType: 'heartbeat';
    /** 状态信息 */
    status: {
      /** HTTP API 插件已初始化 */
      appInitialized: boolean;
      /** HTTP API 插件已启用 */
      appEnabled: boolean;
      /** HTTP API 的各内部插件是否正常运行 */
      pluginsGood: object;
      /** HTTP API 插件正常运行（已初始化、已启用、各内部插件正常运行） */
      appGood: boolean;
      /** 当前 QQ 在线，null 表示无法查询到在线状态 */
      online: boolean;
      /** HTTP API 插件状态符合预期，意味着插件已初始化，内部插件都在正常运行，且 QQ 在线 */
      good: boolean;
    };
  }
}
