import { ServerResponse } from 'http';

/** CQNode事件响应对象 */
export namespace CQResponse {
  /** CQNode事件响应对象 */
  interface Response {
    /** 原始http response对象，通常情况下不建议直接调用此对象 */
    originalResponse: ServerResponse;
    /** response响应数据，通常情况下不建议直接修改此对象内容 */
    responseBody: {
      [field: string]: any;
    };
  }
  /** 空响应，该事件没有可用的resp响应 */
  interface Empty extends Response {}
  /** 消息类事件 */
  interface Message extends Response {
    /**
     * 回复消息
     * @param message 回复信息
     * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码）
     */
    reply(message: string, autoEscape?: boolean): this;
  }

  /** 私聊消息事件 */
  interface PrivateMessage extends Message {}

  /** 群消息事件 */
  interface GroupMessage extends Message {
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
  interface DiscussMessage extends Message {
    /** 是否要在回复开头at发送者 */
    at(at: boolean): this;
  }

  /** 通知类事件 */
  interface Notice extends Response {
    /**
     * 向通知来源私聊/群/讨论组发送消息
     * @param message 回复信息
     */
    send(message: string): this;
  }

  /** 群文件上传 */
  interface GroupUploadNotice extends Notice {}

  /** 群管理员变动 */
  interface GroupAdminNotice extends Notice {}

  /** 群成员减少 */
  interface GroupDecreaseNotice extends Notice {}

  /** 群成员增加 */
  interface GroupIncreaseNotice extends Notice {}

  /** 好友添加 */
  interface FriendAddNotice extends Notice {}

  /** 请求类事件 */
  interface Request extends Response {}

  /** 加好友请求 */
  interface FriendRequest extends Request {
    /**
     * 是否同意请求
     * @param approve 是否同意请求
     * @param remark 添加后的好友备注（仅在approve=true时有效）
     */
    approve(approve: boolean, remark?: string): this;
  }

  /** 加群请求 */
  interface GroupRequest extends Request {
    /**
     * 是否同意请求
     * @param approve 是否同意请求/邀请
     * @param reason 拒绝理由（仅在拒绝时有效）
     */
    approve(approve: boolean, reason?: string): this;
  }

  /** 元事件 */
  interface Meta extends Response {}

  /** 生命周期 */
  interface LifecycleMeta extends Meta {}
  
  /** 心跳 */
  interface HeartbeatMeta extends Meta {}
}