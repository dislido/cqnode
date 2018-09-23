/**
 * 接收到的私聊消息对象
 */
declare class PrivateMsg {
  /**
   * 私聊消息来源 好友|群|其他
   */
  subType: 'friend'|'group'|'other';
  /**
   * 发送人QQ号
   */
  fromQQ: number;
  /**
   * 消息内容
   */
  msg: string;
  /**
   * 消息ID
   */
  msgId: number;
  /**
   * 字体
   */
  font: number;
  /**
   * 原始消息内容
   */
  rawMessage: string;
}
/**
 * 接收到的私聊消息对象
 */
declare class GroupMsg {
  /**
   * 群消息类型 一般群消息|系统提示
   */
  subType: 'normal'|'notice';
  /**
   * 发送人QQ号
   */
  fromQQ: number;
  /**
   * 群号码
   */
  fromGroup: number;
  /**
   * 消息内容
   */
  msg: string;
  /**
   * 消息ID
   */
  msgId: number;
  /**
   * 字体
   */
  font: number;
  /**
   * 原始消息内容
   */
  rawMessage: string;
}