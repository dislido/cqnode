/** CQHTTP API */
declare namespace CQHTTP {
  interface ResponseData<T> {
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
  
  interface GetGroupListResponseData extends Array<{
    /** 群号 */
    group_id: number;
    /** 群名称 */
    group_name: string;
  }> {}
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
export interface CQAPI {
  /**
   * 发送私聊消息  
   * @param userId 对方QQ号
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendPrivateMsg(userId: number, message: string, autoEscape?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.SendMsgResponseData>>;

  /**
   * 发送群消息  
   * @param groupId 群号
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendGroupMsg(groupId: number, message: string, autoEscape?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.SendMsgResponseData>>;
  
  /**
   * 发送讨论组消息  
   * @param discussId 讨论组 ID（正常情况下看不到，需要从讨论组消息上报的数据中获得）
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendDiscussMsg(discussId: number, message: string, autoEscape?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.SendMsgResponseData>>;

  /**
   * 发送消息  
   * @param messageType 消息类型 private:私聊/group:群组/discuss:讨论组
   * @param id 要发送到的私聊/群/讨论组号码
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendMsg(messageType: 'private' | 'group' | 'discuss', id: number, message: string, autoEscape?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.SendMsgResponseData>>;

  /**
   * 撤回消息
   * @param messageId 消息ID
   */
  deleteMsg(messageId: number): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 发送好友赞
   * @param userId 对方QQ号
   * @param times 赞的次数，每个好友每天最多10次
   */
  sendLike(userId: number, times?: number): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 群组踢人
   * @param group_id 群号
   * @param user_id 要踢的 QQ 号
   * @param reject_add_request 拒绝此人的加群请求
   */
  setGroupKick(groupId: number, userId: number, rejectAddRequest?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 群组单人禁言
   * @param group_id 群号
   * @param user_id 要禁言的 QQ 号
   * @param duration 禁言时长，单位秒，0 表示取消禁言
   */
  setGroupBan(groupId: number, userId: number, duration?: number): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 群组匿名用户禁言
   * @param group_id 群号
   * @param anonymous_flag 或 flag 可选，要禁言的匿名用户的 flag（需从群消息上报的数据中获得）
   * @param duration 禁言时长，单位秒，无法取消匿名用户禁言
   * 上面的 anonymous 和 anonymous_flag 两者任选其一传入即可，若都传入，则使用 anonymous。
   */
  setGroupAnonymousBan(groupId: number, anonymousFlag: string, duration?: number): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 群组全员禁言
   * @param group_id 群号
   * @param enable 是否禁言
   */
  setGroupWholeBan(groupId: number, enable?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 群组设置管理员
   * @param group_id 群号
   * @param user_id 要设置管理员的 QQ 号
   * @param enable true 为设置，false 为取消
   */
  setGroupAdmin(groupId: number, userId: number, enable?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 群组匿名
   * @param group_id 群号
   * @param enable 是否允许匿名聊天
   */
  setGroupAnonymous(groupId: number, enable?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 设置群名片（群备注）
   * @param group_id 群号
   * @param user_id 要设置的 QQ 号
   * @param card 群名片内容，不填或空字符串表示删除群名片
   */
  setGroupCard(groupId: number, userId: number, card?: string): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 退出群组
   * @param group_id 群号
   * @param is_dismiss 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散
   */
  setGroupLeave(groupId: number, isDismiss?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 设置群组专属头衔
   * @param group_id 群号
   * @param user_id 要设置的 QQ 号
   * @param special_title 专属头衔，不填或空字符串表示删除专属头衔
   * @param duration 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果，可能是只有某些特殊的时间长度有效，有待测试
   */
  setGroupSpecialTitle(groupId: number, userId: number, specialTitle?: string, duration?: number): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 退出讨论组
   * @param discuss_id 讨论组 ID（正常情况下看不到，需要从讨论组消息上报的数据中获得）
   */
  setDiscussLeave(discussId: number): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 处理加好友请求
   * @param flag 加好友请求的 flag（需从上报的数据中获得）
   * @param approve 是否同意请求
   * @param remark 添加后的好友备注（仅在同意时有效）
   */
  setFriendAddRequest(flag: string, approve?: boolean, remark?: string): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 处理加群请求／邀请
   * @param flag 加群请求的 flag（需从上报的数据中获得）
   * @param subType add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）
   * @param approve 是否同意请求／邀请
   * @param reason 拒绝理由（仅在拒绝时有效）
   */
  setGroupAddRequest(flag: string, subType: 'add' | 'invite', approve?: boolean, reason?: string): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 获取登录号信息
   */
  getLoginInfo(): Promise<CQHTTP.ResponseData<CQHTTP.GetLoginInfoResponseData>>;

  /**
   * 获取陌生人信息
   * @param user_id QQ 号
   * @param no_cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快）
   */
  getStrangerInfo(userId: number, noCache?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.GetStrangerInfoResponseData>>;

  /**
   * 获取群列表
   */
  getGroupList(): Promise<CQHTTP.ResponseData<CQHTTP.GetGroupListResponseData>>;

  /**
   * 获取群成员信息
   * @param group_id 群号
   * @param user_id QQ 号
   * @param no_cache 是否不使用缓存（使用缓存可能更新不及时，但响应更快）
   */
  getGroupMemberInfo(groupId: number, userId: number, noCache?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.GetGroupMemberInfoResponseData>>;

  /**
   * 获取群成员列表
   * @param group_id 群号
   * @returns 响应内容为 JSON 数组，每个元素的内容和 getGroupMemberInfo 接口相同，但对于同一个群组的同一个成员，获取列表时和获取单独的成员信息时，某些字段可能有所不同，例如 area、title 等字段在获取列表时无法获得，具体应以单独的成员信息为准。
   */
  getGroupMemberList(groupId: number): Promise<CQHTTP.ResponseData<CQHTTP.GetGroupMemberInfoResponseData[]>>;

  /**
   * 获取 cookies
   */
  getCookies(): Promise<CQHTTP.ResponseData<CQHTTP.GetCookiesResponseData>>;

  /**
   * 获取 csrf token
   */
  getCsrfToken(): Promise<CQHTTP.ResponseData<CQHTTP.GetCsrfTokenResponseData>>;

  /**
   * 获取 qq 相关接口凭证 即 getCookies getCsrfToken 两个接口的合并。
   */
  getCredentials(): Promise<CQHTTP.ResponseData<CQHTTP.GetCookiesResponseData & CQHTTP.GetCsrfTokenResponseData>>;

  /**
   * 获取语音 其实并不是真的获取语音，而是转换语音到指定的格式，然后返回语音文件名（data\record 目录下）。注意，要使用此接口，需要安装 酷Q 的 语音组件。
   * @param file 收到的语音文件名（CQ 码的 file 参数），如 0B38145AA44505000B38145AA4450500.silk
   * @param out_format 要转换到的格式，目前支持 mp3、amr、wma、m4a、spx、ogg、wav、flac
   * @param full_path 是否返回文件的绝对路径（Windows 环境下建议使用，Docker 中不建议）
   * @returns 若full_path为false，则只返回文件名，否则返回完整路径
   */
  getRecord(file: string, outFormat: string, fullPath?: boolean): Promise<CQHTTP.ResponseData<CQHTTP.GetFileResponseData>>;

  /**
   * 获取图片
   * @param file 收到的图片文件名（CQ 码的 file 参数），如 6B4DE3DFD1BD271E3297859D41C530F5.jpg
   * @returns 图片完整路径
   */
  getImage(file: string): Promise<CQHTTP.ResponseData<CQHTTP.GetFileResponseData>>;

  /**
   * 检查是否可以发送图片
   */
  canSendImage(): Promise<CQHTTP.ResponseData<CQHTTP.CanSendResponseData>>;

  /**
   * 检查是否可以发送语音
   */
  canSendRecord(): Promise<CQHTTP.ResponseData<CQHTTP.CanSendResponseData>>;

  /**
   * 获取插件运行状态
   * @returns 通常情况下建议只使用 online 和 good 这两个字段来判断运行状态，因为随着插件的更新，其它字段有可能频繁变化。  其中，online 字段的在线状态检测有两种方式，可通过 online_status_detection_method 配置项切换，默认通过读取 酷Q 日志数据库实现，可切换为 get_stranger_info 以通过测试陌生人查询接口的可用性来检测。具体区别如下：
   */
  getStatus(): Promise<CQHTTP.ResponseData<CQHTTP.GetStatusResponseData>>;

  /**
   * 获取 酷q 及 http api 插件的版本信息
   */
  getVersionInfo(): Promise<CQHTTP.ResponseData<CQHTTP.GetVersionInfoResponseData>>;

  /**
   * 重启 http api 插件 由于重启插件同时需要重启 API 服务，这意味着当前的 API 请求会被中断，因此需在异步地重启插件，接口返回的 status 是 async。
   * @param delay 要延迟的毫秒数，如果默认情况下无法重启，可以尝试设置延迟为 2000 左右
   */
  setRestartPlugin(delay?: number): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 清理数据目录 用于清理积攒了太多旧文件的数据目录，如 image。
   * @param data_dir 收到清理的目录名，支持 image、record、show、bface
   */
  cleanDataDir(dataDir: string): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;

  /**
   * 清理插件日志 用于清空插件的日志文件。
   */
  cleanPluginLog(): Promise<CQHTTP.ResponseData<CQHTTP.EmptyResponseData>>;
}
