
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
  interface Message extends Event {
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
    /** 发送人名称，会尽可能提供在聊天窗口显示的名称 */
    username: string;
    /** 是否at了本账号，私聊消息中总是为true */
    atme: boolean;
    /**
     * 对message进行过预处理操作后的字符串
     * (移除at信息部分，删除首尾空格)
     */
    msg: string;
  }

  /** 私聊消息事件 */
  interface PrivateMessage extends Message {
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
  interface GroupMessage extends Message {
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
  interface DiscussMessage extends Message {
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
  interface Notice extends Event {
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
  interface GroupUploadNotice extends Notice {
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
  interface GroupAdminNotice extends Notice {
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
  interface GroupDecreaseNotice extends Notice {
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
  interface GroupIncreaseNotice extends Notice {
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
  interface FriendAddNotice extends Notice {
    noticeType: 'friend_add';
    /** 新添加好友 QQ 号 */
    userId: number;
  }

  /** 请求类事件 */
  interface Request extends Event {
    postType: 'request';
    /** 请求类型  
     * friend: 加好友请求  
     * group: 加群请求/邀请
     */
    requestType: 'friend' | 'group';
  }

  /** 加好友请求 */
  interface FriendRequest extends Request {
    requestType: 'friend';
    /** 发送请求的 QQ 号 */
    userId: number;
    /** 验证信息 */
    comment: string;
    /** 请求 flag，在调用处理请求的 API 时需要传入 */
    flag: string;
  }

  /** 加群请求 */
  interface GroupRequest extends Request {
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
  interface Meta extends Event {
    postType: 'meta_event';
    /** 元事件类型  
     * lifecycle: 生命周期  
     * heartbeat: 心跳
     */
    metaEventType: 'lifecycle' | 'heartbeat';
  }

  /** 生命周期 */
  interface LifecycleMeta extends Meta {
    metaEventType: 'lifecycle';
    /** 子类型  
     * enable: 插件启用  
     * disable: 插件停用
     */
    subType: 'enable' | 'disable';
  }
  
  /** 心跳 */
  interface HeartbeatMeta extends Meta {
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

export type EventName = 'PrivateMessage' | 'DiscussMessage' | 'GroupMessage' | 'GroupUploadNotice' |
  'GroupAdminNotice' | 'GroupDecreaseNotice' | 'GroupIncreaseNotice' | 'FriendAddNotice' |
  'FriendRequest' | 'GroupRequest' | 'LifecycleMeta' | 'HeartbeatMeta';
