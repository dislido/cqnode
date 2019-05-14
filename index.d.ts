export as namespace CQNode;
import { ServerResponse } from 'http';

/** CQNode运行时信息 */
interface CQNodeInf {
  /** inf是否已获取 */
  inited: boolean,
  /** api.getLoginInfo, 当前登录号信息 */
  loginInfo: {
    nickname: string,
    userId: number,
  };
  /** 插件运行状态 */
  status: {
    /** 当前 QQ 在线，null 表示无法查询到在线状态 */
    online: boolean;
    /** HTTP API 插件状态符合预期，意味着插件已初始化，内部插件都在正常运行，且 QQ 在线 */
    good: boolean;
  };
  /** 酷Q 及 HTTP API 插件的版本信息 */
  versionInfo: {
    /** 酷Q 根目录路径 */
    coolqDirectory: string;
    /** 酷Q 版本，air 或 pro */
    coolqEdition: string;
    /** HTTP API 插件版本，例如 2.1.3 */
    pluginVersion: string;
    /** HTTP API 插件 build 号 */
    pluginBuildNumber: number;
    /** HTTP API 插件编译配置，debug 或 release */
    pluginBuildConfiguration: string;
  };
  /** 群列表 */
  groupList: CQAPI.GetGroupListResponseData[];
}
interface CQNodeRobot {
  /** 已加载的模块 */
  modules: Module[];
  /** CQ HTTP API */
  api: CQNodeAPI;
  /** CQNode运行时信息 */
  inf: CQNodeInf;
  /** CQNode配置 */
  config: CQNodeConfig;
}

declare interface CQNodeConfig {
  /** 管理员 */
  admin?: string | string[];
  /** 加载的模块 */
  modules?: CQNode.Module[];
  /** 加载的插件 */
  // plugins?: any[];
  /** 数据文件夹 */
  workpath?: string;
  /** HTTP API 连接配置 */
  connector?: {
    /** 事件监听接口 */
    LISTEN_PORT?: number,
    /** HTTP API接口 */
    API_PORT?: number,
    /** 事件处理超时时长（毫秒） */
    TIMEOUT?: number,
  };
  /**
   * atme判断字符串  
   * 以该字符串开头的信息会被任务at了本机器人  
   * 默认使用QQ的at  
   * 空字符串表示将任何消息当作at了本机器人
   */
  prompt?: string | true | Array<string | true>;
}

export function createRobot(config: CQNodeConfig): CQNodeRobot;

/** 模块信息 */
interface CQNodeModuleInf {
  /** 模块包名，应保证唯一，名称中不能包含无法作为文件名的字符，`/`会被替换为`.` */
  packageName: string;
  /** 模块名 */
  name: string;
  /** 模块帮助信息 */
  help: string;
  /** 模块简介 */
  description: string;
}

type EventResult = boolean | void | CQNodeEventResponse.Response;
type EventReturns = EventResult | Promise<EventResult>;

/** CQNode模块 */
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
declare namespace CQNodeEventResponse {
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
declare namespace CQEvent {
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

/** CQHTTP API */
declare namespace CQAPI{
  interface CQHttpResponseData<T> {
    /**
     * ok: 操作成功  
     * async: 请求已提交异步处理  
     * failed: 操作失败，详见retcode字段
     */
    status: 'ok' | 'async ' | 'failed',
    /**
     * 小于 0 时，为调用 酷Q 函数的返回码，详见https://d.cqp.me/Pro/%E5%BC%80%E5%8F%91/Error
     * 0	同时 status 为 ok，表示操作成功  
     * 1	同时 status 为 async，表示操作已进入异步执行，具体结果未知  
     * 100	参数缺失或参数无效，通常是因为没有传入必要参数，某些接口中也可能因为参数明显无效（比如传入的 QQ 号小于等于 0，此时无需调用 酷Q 函数即可确定失败），此项和以下的 status 均为 failed  
     * 102	酷Q 函数返回的数据无效，一般是因为传入参数有效但没有权限，比如试图获取没有加入的群组的成员列表  
     * 103	操作失败，一般是因为用户权限不足，或文件系统异常、不符合预期  
     * 104	由于 酷Q 提供的凭证（Cookie 和 CSRF Token）失效导致请求 QQ 相关接口失败，可尝试清除 酷Q 缓存来解决  
     * 201	工作线程池未正确初始化（无法执行异步任务）
     */
    retcode: number,
    /** 响应数据 */
    data: T,
  }
  
  /** 发送消息的响应数据 */
  interface SendMsgResponseData {
      /** 消息ID */
      message_id: number
  }
  
  /** 无响应数据 */
  interface EmptyResponseData {}
  
  interface GetLoginInfoResponseData {
    /** QQ号 */
    user_id: number;
    /** QQ昵称 */
    nickname: string;
  }
  
  interface GetStrangerInfoResponseData {
    /** QQ号 */
    user_id: number;
    /** 昵称 */
    nickname: string;
    /** 性别 */
    sex: 'male' | 'female' | 'unknown';
    /** 年龄 */
    age: number;
  }
  
  interface GetGroupListResponseData {
    /** 群号 */
    group_id: number;
    /** 群名称 */
    group_name: string;
  }
  
  interface GetGroupMemberInfoResponseData {
    /** 群号 */
    group_id: number;
    /** QQ 号 */
    user_id: number;
    /** 昵称 */
    nickname: string;
    /** 群名片／备注 */
    card: string;
    /** 性别 */
    sex: 'male' | 'female' | 'unknown';
    /** 年龄 */
    age: number;
    /** 地区 */
    area: string;
    /** 加群时间戳 */
    join_time: number;
    /** 最后发言时间戳 */
    last_sent_time: number;
    /** 成员等级 */
    level: string;
    /** 角色,群主/管理员/群成员 */
    role: 'owner' | 'admin' | 'member';
    /** 是否不良记录成员 */
    unfriendly: boolean;
    /** 专属头衔 */
    title: string;
    /** 专属头衔过期时间戳 */
    title_expire_time: number;
    /** 是否允许修改群名片 */
    card_changeable: boolean;
  }
  
  interface GetCookiesResponseData {
    /** Cookies */
    cookies: string;
  }
  
  interface GetCsrfTokenResponseData {
    /** CSRF Token */
    token: number;
  }
  
  interface GetFileResponseData {
    /** 转换后的语音文件名或路径 */
    file: string;
  }
  
  interface CanSendResponseData {
    /** 是或否 */
    yes: boolean;
  }
  
  interface GetStatusResponseData {
    /** HTTP API 插件已初始化 */
    app_initialized: boolean;
    /** HTTP API 插件已启用 */
    app_enabled: boolean;
    /** HTTP API 的各内部插件是否正常运行 */
    plugins_good: object;
    /** HTTP API 插件正常运行（已初始化、已启用、各内部插件正常运行） */
    app_good: boolean;
    /** 当前 QQ 在线，null 表示无法查询到在线状态 */
    online: boolean;
    /** HTTP API 插件状态符合预期，意味着插件已初始化，内部插件都在正常运行，且 QQ 在线 */
    good: boolean;
  }
  
  interface GetVersionInfoResponseData {
    /** 酷Q 根目录路径 */
    coolq_directory: string;
    /** 酷Q 版本 */
    coolq_edition: 'air' | 'pro';
    /** HTTP API 插件版本，例如 2.1.3 */
    plugin_version: string;
    /** HTTP API 插件 build 号 */
    plugin_build_number: number;
    /** HTTP API 插件编译配置 */
    plugin_build_configuration: 'debug' | 'release';
  }
}

declare interface CQNodeAPI {
  /**
   * 发送私聊消息  
   * @param userId 对方QQ号
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendPrivateMsg(userId: number, message: string, autoEscape?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.SendMsgResponseData>>;

  /**
   * 发送群消息  
   * @param groupId 群号
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendGroupMsg(groupId: number, message: string, autoEscape?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.SendMsgResponseData>>;
  
  /**
   * 发送讨论组消息  
   * @param discussId 讨论组 ID（正常情况下看不到，需要从讨论组消息上报的数据中获得）
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendDiscussMsg(discussId: number, message: string, autoEscape?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.SendMsgResponseData>>;

  /**
   * 发送消息  
   * @param messageType 消息类型 private:私聊/group:群组/discuss:讨论组
   * @param id 要发送到的私聊/群/讨论组号码
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendMsg(messageType: 'private' | 'group' | 'discuss', id: number, message: string, autoEscape?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.SendMsgResponseData>>;

  /**
   * 撤回消息
   * @param messageId 消息ID
   */
  deleteMsg(messageId: number): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 发送好友赞
   * @param userId 对方QQ号
   * @param times 赞的次数，每个好友每天最多10次
   */
  sendLike(userId: number, times?: number): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 群组踢人
   * @param group_id 群号
   * @param user_id 要踢的 QQ 号
   * @param reject_add_request 拒绝此人的加群请求
   */
  setGroupKick(groupId: number, userId: number, rejectAddRequest?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 群组单人禁言
   * @param group_id 群号
   * @param user_id 要禁言的 QQ 号
   * @param duration 禁言时长，单位秒，0 表示取消禁言
   */
  setGroupBan(groupId: number, userId: number, duration?: number): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 群组匿名用户禁言
   * @param group_id 群号
   * @param anonymous_flag 或 flag 可选，要禁言的匿名用户的 flag（需从群消息上报的数据中获得）
   * @param duration 禁言时长，单位秒，无法取消匿名用户禁言
   * 上面的 anonymous 和 anonymous_flag 两者任选其一传入即可，若都传入，则使用 anonymous。
   */
  setGroupAnonymousBan(groupId: number, anonymousFlag: string, duration?: number): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 群组全员禁言
   * @param group_id 群号
   * @param enable 是否禁言
   */
  setGroupWholeBan(groupId: number, enable?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 群组设置管理员
   * @param group_id 群号
   * @param user_id 要设置管理员的 QQ 号
   * @param enable true 为设置，false 为取消
   */
  setGroupAdmin(groupId: number, userId: number, enable?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 群组匿名
   * @param group_id 群号
   * @param enable 是否允许匿名聊天
   */
  setGroupAnonymous(groupId: number, enable?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 设置群名片（群备注）
   * @param group_id 群号
   * @param user_id 要设置的 QQ 号
   * @param card 群名片内容，不填或空字符串表示删除群名片
   */
  setGroupCard(groupId: number, userId: number, card?: string): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 退出群组
   * @param group_id 群号
   * @param is_dismiss 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
   */
  setGroupLeave(groupId: number, isDismiss?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 设置群组专属头衔
   * @param group_id 群号
   * @param user_id 要设置的 QQ 号
   * @param special_title 专属头衔，不填或空字符串表示删除专属头衔
   * @param duration 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果，可能是只有某些特殊的时间长度有效，有待测试
   */
  setGroupSpecialTitle(groupId: number, userId: number, specialTitle?: string, duration?: number): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 退出讨论组
   * @param discuss_id 讨论组 ID（正常情况下看不到，需要从讨论组消息上报的数据中获得）
   */
  setDiscussLeave(discussId: number): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 处理加好友请求
   * @param flag 加好友请求的 flag（需从上报的数据中获得）
   * @param approve 是否同意请求
   * @param remark 添加后的好友备注（仅在同意时有效）
   */
  setFriendAddRequest(flag: string, approve?: boolean, remark?: string): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 处理加群请求／邀请
   * @param flag 加群请求的 flag（需从上报的数据中获得）
   * @param subType add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）
   * @param approve 是否同意请求／邀请
   * @param reason 拒绝理由（仅在拒绝时有效）
   */
  setGroupAddRequest(flag: string, subType: 'add' | 'invite', approve?: boolean, reason?: string): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 获取登录号信息
   * 无
   */
  getLoginInfo(): Promise<CQAPI.CQHttpResponseData<CQAPI.GetLoginInfoResponseData>>;

  /**
   * 获取陌生人信息
   * @param user_id QQ 号
   * @param no_cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快）
   */
  getStrangerInfo(userId: number, noCache?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.GetStrangerInfoResponseData>>;

  /**
   * 获取群列表
   */
  getGroupList(): Promise<CQAPI.CQHttpResponseData<CQAPI.GetGroupListResponseData[]>>;

  /**
   * 获取群成员信息
   * @param group_id 群号
   * @param user_id QQ 号
   * @param no_cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快）
   */
  getGroupMemberInfo(groupId: number, userId: number, noCache?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.GetGroupMemberInfoResponseData>>;

  /**
   * 获取群成员列表
   * @param group_id 群号
   * @returns 响应内容为 JSON 数组，每个元素的内容和 getGroupMemberInfo 接口相同，但对于同一个群组的同一个成员，获取列表时和获取单独的成员信息时，某些字段可能有所不同，例如 area、title 等字段在获取列表时无法获得，具体应以单独的成员信息为准。
   */
  getGroupMemberList(groupId: number): Promise<CQAPI.CQHttpResponseData<CQAPI.GetGroupMemberInfoResponseData[]>>;

  /**
   * 获取 cookies
   */
  getCookies(): Promise<CQAPI.CQHttpResponseData<CQAPI.GetCookiesResponseData>>;

  /**
   * 获取 csrf token
   */
  getCsrfToken(): Promise<CQAPI.CQHttpResponseData<CQAPI.GetCsrfTokenResponseData>>;

  /**
   * 获取 qq 相关接口凭证 即 getCookies getCsrfToken 两个接口的合并。
   */
  getCredentials(): Promise<CQAPI.CQHttpResponseData<CQAPI.GetCookiesResponseData & CQAPI.GetCsrfTokenResponseData>>;

  /**
   * 获取语音 其实并不是真的获取语音，而是转换语音到指定的格式，然后返回语音文件名（data\record 目录下）。注意，要使用此接口，需要安装 酷Q 的 语音组件。
   * @param file 收到的语音文件名（CQ 码的 file 参数），如 0B38145AA44505000B38145AA4450500.silk
   * @param out_format 要转换到的格式，目前支持 mp3、amr、wma、m4a、spx、ogg、wav、flac
   * @param full_path 是否返回文件的绝对路径（Windows 环境下建议使用，Docker 中不建议）
   * @returns 若full_path为false，则只返回文件名，否则返回完整路径
   */
  getRecord(file: string, outFormat: string, fullPath?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.GetFileResponseData>>;

  /**
   * 获取图片
   * @param file 收到的图片文件名（CQ 码的 file 参数），如 6B4DE3DFD1BD271E3297859D41C530F5.jpg
   * @returns 图片完整路径
   */
  getImage(file: string): Promise<CQAPI.CQHttpResponseData<CQAPI.GetFileResponseData>>;

  /**
   * 检查是否可以发送图片
   */
  canSendImage(): Promise<CQAPI.CQHttpResponseData<CQAPI.CanSendResponseData>>;

  /**
   * 检查是否可以发送语音
   */
  canSendRecord(): Promise<CQAPI.CQHttpResponseData<CQAPI.CanSendResponseData>>;

  /**
   * 获取插件运行状态
   * @returns 通常情况下建议只使用 online 和 good 这两个字段来判断运行状态，因为随着插件的更新，其它字段有可能频繁变化。  其中，online 字段的在线状态检测有两种方式，可通过 online_status_detection_method 配置项切换，默认通过读取 酷Q 日志数据库实现，可切换为 get_stranger_info 以通过测试陌生人查询接口的可用性来检测。具体区别如下：
   */
  getStatus(): Promise<CQAPI.CQHttpResponseData<CQAPI.GetStatusResponseData>>;

  /**
   * 获取 酷q 及 http api 插件的版本信息
   */
  getVersionInfo(): Promise<CQAPI.CQHttpResponseData<CQAPI.GetVersionInfoResponseData>>;

  /**
   * 重启 http api 插件 由于重启插件同时需要重启 API 服务，这意味着当前的 API 请求会被中断，因此需在异步地重启插件，接口返回的 status 是 async。
   * @param delay 要延迟的毫秒数，如果默认情况下无法重启，可以尝试设置延迟为 2000 左右
   */
  setRestartPlugin(delay?: number): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 清理数据目录 用于清理积攒了太多旧文件的数据目录，如 image。
   * @param data_dir 收到清理的目录名，支持 image、record、show、bface
   */
  cleanDataDir(dataDir: string): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 清理插件日志 用于清空插件的日志文件。
   */
  cleanPluginLog(): Promise<CQAPI.CQHttpResponseData<CQAPI.EmptyResponseData>>;

  /**
   * 群广播消息，将消息发送给指定的所有群
   * @param message 要发送的内容
   * @param groups 群号数组，默认为群列表中的所有群
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   * @returns 每个消息的发送结果的Promise数组
   */
  groupRadio(message: string, groups?: number[], autoEscape?: boolean): Promise<CQAPI.CQHttpResponseData<CQAPI.SendMsgResponseData>>[];
}
