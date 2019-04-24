import { ServerResponse } from "http";

declare interface CQNodeConfig {
  /** 本机器人ID @deprecated CQNode将会自动获取到此值 */
  qqid: string;
  /** 管理员 */
  admin: string | string[];
  /** 监听的群列表 */
  listenGroups: string[];
  /** 加载的模块 */
  modules: any[];
  /** 加载的插件 */
  plugins: any[];
  /** 数据文件夹 */
  workpath: string;
  /**
   * atme判断字符串  
   * 以该字符串开头的信息会被任务at了本机器人  
   * 默认使用QQ的at  
   * 空字符串表示将任何消息当作at了本机器人
   */
  prompt?: string;
}

type EventResult = boolean | undefined | CQNodeEventResponse.Response;
type EventReturns = EventResult | Promise<EventResult>;

/** 模块信息 */
declare interface CQNodeModuleInf {
  /** 模块包名，应保证唯一 */
  packageName: string;
  /** 模块名 */
  name: string;
  /** 模块帮助信息 */
  help: string;
  /** 模块简介 */
  description: string;
}

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