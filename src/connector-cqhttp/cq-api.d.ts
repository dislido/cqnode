declare interface CQHttpResponseData<T> {
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

declare interface CQAPI {
  /**
   * 发送私聊消息  
   * @param userId 对方QQ号
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendPrivateMsg(userId: number, message: string, autoEscape?: boolean): Promise<CQHttpResponseData<SendMsgResponseData>>;
  /**
   * 发送群消息  
   * @param groupId 群号
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendGroupMsg(groupId: number, message: string, autoEscape?: boolean): Promise<CQHttpResponseData<SendMsgResponseData>>;
  
  /**
   * 发送讨论组消息  
   * @param discussId 讨论组 ID（正常情况下看不到，需要从讨论组消息上报的数据中获得）
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendDiscussMsg(discussId: number, message: string, autoEscape?: boolean): Promise<CQHttpResponseData<SendMsgResponseData>>;
  /**
   * 发送消息  
   * @param messageType 消息类型 private:私聊/group:群组/discuss:讨论组
   * @param id 要发送到的私聊/群/讨论组号码
   * @param message 要发送的内容
   * @param autoEscape 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
   */
  sendMsg(messageType: 'private' | 'group' | 'discuss', id: number, message: string, autoEscape?: boolean): Promise<CQHttpResponseData<SendMsgResponseData>>;
}
