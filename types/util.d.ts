import { EventName, CQEvent } from './cq-http';
/** CQCode字符串 */
declare class CQCodeString extends String {
  /** 转换为对象形式 */
  parse(this: string): CQCodeData;
}

type CQCodeData = {
  type: string;
  data: {
    [key: string]: string;
  }
};

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
  interface CQCode {
    (type: string, data?: { [key:string]: string | number | boolean }): CQCodeString;
  
    /** CQCode字符串 */
    String: typeof CQCodeString;
    
    /**
     * 解析CQ码字符串为对象形式
     * @param code CQ码字符串
     * @returns 解析的对象，若CQ码格式不正确则返回`undefined`
     */
    parseCQCodeString(code: string): CQCodeData | undefined;
    /**
     * 系统表情
     * @param id 表情编号
     */
    face(id: number): CQCodeString;
    /**
     * emoji表情
     * @param id unicode编号
     */
    emoji(id: number): CQCodeString;
    /**
     * 原创表情
     * @param id 该原创表情的ID，存放在酷Q目录的data\bface\下
     */
    bface(id: number): CQCodeString;
    /**
     * 小表情
     * @param id 该小表情的ID
     */
    sface(id: number): CQCodeString;
    /**
     * 自定义图片
     * @param file 图片文件名称，图片存放在酷Q目录的data\image\下
     */
    image(file: string): CQCodeString;
    /**
     * 语音
     * @param file 音频文件名称，音频存放在酷Q目录的data\record\下
     * @param magic 是否为变声，若该参数为true则显示变声标记
     */
    record(file: string, magic?: boolean): CQCodeString;
    /**
     * at
     * @param qq `被@的群成员帐号。若该参数为all，则@全体成员（次数用尽或权限不足则会转换为文本）`
     */
    at(qq: number): CQCodeString;
    /**
     * 猜拳魔法表情
     * @param type 猜拳结果的类型，暂不支持发送时自定义  
     * - 1 猜拳结果为石头
     * - 2 猜拳结果为剪刀
     * - 3 猜拳结果为布
     */
    rps(type?: 1 | 2 | 3): CQCodeString;
    /**
     * 掷骰子魔法表情
     * @param type 掷出的点数，暂不支持发送时自定义
     */
    dice(type?: 1 | 2 | 3 | 4 | 5 | 6): CQCodeString;
    /** 戳一戳（原窗口抖动，仅支持好友消息使用） */
    shake(): CQCodeString;
    /**
     * 匿名发消息（仅支持群消息使用）,本CQ码需加在消息的开头
     * @param ignore 允许忽略匿名，若为`true`，匿名失败将转为普通消息发送，若为`false`或空，匿名失败将取消该消息的发送
     */
    anonymous(ignore?: boolean): CQCodeString;
    /**
     * 发送音乐
     * @param type 音乐平台类型
     * @param id 对应音乐平台的数字音乐id
     */
    music(type: 'qq' | '163' | 'xiami', id: number): CQCodeString;
    /**
     * 发送音乐自定义分享
     * @param url 分享链接，即点击分享后进入的音乐页面（如歌曲介绍页）
     * @param audio 音频链接（如mp3链接）
     * @param title 音乐的标题，建议12字以内
     * @param content 音乐的简介，建议30字以内
     * @param image 音乐的封面图片链接。若参数为空或被忽略，则显示默认图片
     */
    music(type: 'custom', url: string, audio: string, title: string, content?: string, image?: string): CQCodeString;
    /**
     * 发送链接分享
     * @param url 分享链接
     * @param title 分享的标题，建议12字以内
     * @param content 分享的简介，建议30字以内
     * @param image 分享的图片链接。若参数为空或被忽略，则显示默认图片
     */
    share(url: string, title: string, content?: string, image?: string): CQCodeString;
  }

  /**
   * 生成CQCode字符串
   * @param type CQCode类型
   * @param data CQCode数据
   */
  const CQCode: CQCode;
}