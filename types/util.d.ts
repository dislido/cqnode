import { EventName, CQEvent } from './cq-http';
/**
 * 工具库
 */
export namespace util {
  /**
   * 事件类型判断工具
   */
  namespace eventType {
    /** 是否是消息事件 */
    function isMessage(event: CQEvent.Event): event is CQEvent.Message;
    /** 是否是通知事件 */
    function isNotice(event: CQEvent.Event): event is CQEvent.Notice;
    /** 是否是请求事件 */
    function isRequest(event: CQEvent.Event): event is CQEvent.Request;
    /** 是否是元事件 */
    function isMetaEvent(event: CQEvent.Event): event is CQEvent.Meta;
    
    /** 是否是私聊消息事件 */
    function isPrivateMessage(event: CQEvent.Event): event is CQEvent.PrivateMessage;
    /** 是否是讨论组消息事件 */
    function isDiscussMessage(event: CQEvent.Event): event is CQEvent.DiscussMessage;
    /** 是否是群消息事件 */
    function isGroupMessage(event: CQEvent.Event): event is CQEvent.GroupMessage;
    
    /** 是否是群文件上传通知事件 */
    function isGroupUploadNotice(event: CQEvent.Event): event is CQEvent.GroupUploadNotice;
    /** 是否是群管理员变动通知事件 */
    function isGroupAdminNotice(event: CQEvent.Event): event is CQEvent.GroupAdminNotice;
    /** 是否是群成员减少通知事件 */
    function isGroupDecreaseNotice(event: CQEvent.Event): event is CQEvent.GroupDecreaseNotice;
    /** 是否是群成员增加通知事件 */
    function isGroupIncreaseNotice(event: CQEvent.Event): event is CQEvent.GroupIncreaseNotice;
    /** 是否是好友添加通知事件 */
    function isFriendAddNotice(event: CQEvent.Event): event is CQEvent.FriendAddNotice;
    
    /** 是否是加好友请求事件 */
    function isFriendRequest(event: CQEvent.Event): event is CQEvent.FriendRequest;
    /** 是否是加群请求事件 */
    function isGroupRequest(event: CQEvent.Event): event is CQEvent.GroupRequest;
    
    /** 是否是生命周期元事件 */
    function isLifecycleMeta(event: CQEvent.Event): event is CQEvent.LifecycleMeta;
    /** 是否是心跳元事件 */
    function isHeartbeatMeta(event: CQEvent.Event): event is CQEvent.HeartbeatMeta;
    
    /** 获取事件名 */
    function assertEventName(event: CQEvent.Event): EventName;
  }
  namespace CQCode {
    type CQCodeData = {
      type: string;
      data: {
        [key: string]: string;
      }
    };
    /**
     * 解析CQ码字符串为对象形式
     * @param code CQ码字符串
     * @returns 解析的对象，若CQ码格式不正确则返回`undefined`
     */
    function parseString(code: string): CQCodeData | undefined;
  }
}