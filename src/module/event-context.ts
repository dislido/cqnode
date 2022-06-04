import { MessageRet, Sendable } from 'oicq';
import CQNodeRobot from '../cqnode-robot';
import CQEventType, { CQEvent } from '../connector-oicq/event-type';
import { checkAtme } from './utils';

/** @todo */
export interface CQNodeEventContextMap {
  [CQEventType.systemLoginQrcode]: CQNodeEventContextMap['']; // 收到二维码
  [CQEventType.systemLoginSlider]: CQNodeEventContextMap['']; // 滑动验证码
  [CQEventType.systemLoginDevice]: CQNodeEventContextMap['']; // 设备锁
  [CQEventType.systemLoginError]: CQNodeEventContextMap['']; // 登录错误
  [CQEventType.systemOnline]: CQNodeEventContextMap['']; // 上线
  [CQEventType.systemOfflineKickoff]: CQNodeEventContextMap['']; // 服务器踢下线
  [CQEventType.systemOfflineNetwork]: CQNodeEventContextMap['']; // 网络错误导致下线
  [CQEventType.requestFriend]: CQNodeEventContextMap['']; // 好友申请
  [CQEventType.requestGroupAdd]: CQNodeEventContextMap['']; // 加群申请
  /** 群邀请 */
  [CQEventType.requestGroupInvite]: CQNodeEventContextMap[''] & {
    /**
     * 处理请求并结束处理事件
     * @param approve 是否同意入群
     */
    reply(approve?: boolean): Promise<boolean>;
  };
  [CQEventType.request]: CQNodeEventContextMap['']; // 全部请求
  /** 群消息 */
  [CQEventType.messageGroup]: CQNodeEventContextMap[CQEventType.message];
  [CQEventType.messagePrivate]: CQNodeEventContextMap['']; // 私聊消息
  [CQEventType.messageDiscuss]: CQNodeEventContextMap['']; // 讨论组消息
  /** 全部消息 */
  [CQEventType.message]: CQNodeEventContextMap[''] & {
    /**
     * 回复消息并结束处理事件
     * @param message 回复内容
     * @param quote 是否引用
     */
    reply(message: Sendable, quote?: boolean): Promise<MessageRet>;
    /** 群/讨论组消息中是否命中atmeTrigger判断，私聊消息中固定为true */
    atme: boolean;
  };
  [CQEventType.noticeFriendIncrease]: CQNodeEventContextMap['']; // 好友增加
  [CQEventType.noticeFriendDecrease]: CQNodeEventContextMap['']; // 好友减少
  [CQEventType.noticeFriendRecall]: CQNodeEventContextMap['']; // 好友撤回
  [CQEventType.noticeFriendPoke]: CQNodeEventContextMap['']; // 好友戳一戳
  [CQEventType.noticeFriend]: CQNodeEventContextMap['']; // 好友通知
  [CQEventType.noticeGroupIncrease]: CQNodeEventContextMap['']; // 群员增加
  [CQEventType.noticeGroupDecrease]: CQNodeEventContextMap['']; // 群员减少
  [CQEventType.noticeGroupRecall]: CQNodeEventContextMap['']; // 群撤回
  [CQEventType.noticeGroupPoke]: CQNodeEventContextMap['']; // 群戳一戳
  [CQEventType.noticeGroupBan]: CQNodeEventContextMap['']; // 群禁言
  [CQEventType.noticeGroupAdmin]: CQNodeEventContextMap['']; // 群管理变更
  [CQEventType.noticeGroupTransfer]: CQNodeEventContextMap['']; // 群转让
  [CQEventType.noticeGroup]: CQNodeEventContextMap['']; // 群通知
  [CQEventType.notice]: CQNodeEventContextMap['']; // 全部通知
  [CQEventType.syncMessage]: CQNodeEventContextMap['']; // 私聊消息同步
  [CQEventType.syncRead]: CQNodeEventContextMap['']; // 已读同步
  [CQEventType.guildMessage]: CQNodeEventContextMap['']; // 频道消息
  '': {
    /** 事件对象 */
    event: CQEvent;
    /** 是否结束处理 */
    end: boolean;
  };
}

export const EventContextBuilderMap: {
  [evType in CQEventType | '']: (event: CQEvent, cqnode: CQNodeRobot) => CQNodeEventContextMap[evType];
} = {
  [CQEventType.systemLoginQrcode](event: CQEvent<CQEventType.systemLoginQrcode>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 收到二维码
  [CQEventType.systemLoginSlider](event: CQEvent<CQEventType.systemLoginSlider>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 滑动验证码
  [CQEventType.systemLoginDevice](event: CQEvent<CQEventType.systemLoginDevice>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 设备锁
  [CQEventType.systemLoginError](event: CQEvent<CQEventType.systemLoginError>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 登录错误
  [CQEventType.systemOnline](event: CQEvent<CQEventType.systemOnline>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 上线
  [CQEventType.systemOfflineKickoff](event: CQEvent<CQEventType.systemOfflineKickoff>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 服务器踢下线
  [CQEventType.systemOfflineNetwork](event: CQEvent<CQEventType.systemOfflineNetwork>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 网络错误导致下线
  [CQEventType.requestFriend](event: CQEvent<CQEventType.requestFriend>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 好友申请
  [CQEventType.requestGroupAdd](event: CQEvent<CQEventType.requestGroupAdd>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 加群申请
  [CQEventType.requestGroupInvite](event: CQEvent<CQEventType.requestGroupInvite>, cqnode: CQNodeRobot) {
    const ctx = {
      ...this[''](event, cqnode),
      reply(approve = true) {
        ctx.end = true;
        return event.approve(approve);
      },
    };
    return ctx;
  }, // 群邀请
  [CQEventType.request](event: CQEvent<CQEventType.request>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 全部请求
  [CQEventType.messageGroup](event: CQEvent<CQEventType.messageGroup>, cqnode: CQNodeRobot) {
    return {
      ...this[CQEventType.message](event, cqnode),
    };
  }, // 群消息
  [CQEventType.messagePrivate](event: CQEvent<CQEventType.messagePrivate>, cqnode: CQNodeRobot) { return { ...this[CQEventType.message](event, cqnode), atme: true }; }, // 私聊消息
  [CQEventType.messageDiscuss](event: CQEvent<CQEventType.messageDiscuss>, cqnode: CQNodeRobot) { return { ...this[CQEventType.message](event, cqnode) }; }, // 讨论组消息
  [CQEventType.message](event: CQEvent<CQEventType.message>, cqnode: CQNodeRobot) {
    const ctx = {
      ...this[''](event, cqnode),
      /** 回复消息并结束此事件 */
      reply: (message: Sendable, quote?: boolean) => {
        ctx.end = true;
        return event.reply(message, quote);
      },
      atme: checkAtme(event, cqnode.config.atmeTrigger, cqnode.connect.client.uin),
      /** @todo CQCode格式的string类型message */
      // msg,
      /** @todo 是否是简单文字消息（移除atmeTrigger后） */
      // isSimpleMessage,
    };
    return ctx;
  }, // 全部消息
  [CQEventType.noticeFriendIncrease](event: CQEvent<CQEventType.noticeFriendIncrease>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 好友增加
  [CQEventType.noticeFriendDecrease](event: CQEvent<CQEventType.noticeFriendDecrease>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 好友减少
  [CQEventType.noticeFriendRecall](event: CQEvent<CQEventType.noticeFriendRecall>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 好友撤回
  [CQEventType.noticeFriendPoke](event: CQEvent<CQEventType.noticeFriendPoke>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 好友戳一戳
  [CQEventType.noticeFriend](event: CQEvent<CQEventType.noticeFriend>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 好友通知
  [CQEventType.noticeGroupIncrease](event: CQEvent<CQEventType.noticeGroupIncrease>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 群员增加
  [CQEventType.noticeGroupDecrease](event: CQEvent<CQEventType.noticeGroupDecrease>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 群员减少
  [CQEventType.noticeGroupRecall](event: CQEvent<CQEventType.noticeGroupRecall>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 群撤回
  [CQEventType.noticeGroupPoke](event: CQEvent<CQEventType.noticeGroupPoke>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 群戳一戳
  [CQEventType.noticeGroupBan](event: CQEvent<CQEventType.noticeGroupBan>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 群禁言
  [CQEventType.noticeGroupAdmin](event: CQEvent<CQEventType.noticeGroupAdmin>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 群管理变更
  [CQEventType.noticeGroupTransfer](event: CQEvent<CQEventType.noticeGroupTransfer>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 群转让
  [CQEventType.noticeGroup](event: CQEvent<CQEventType.noticeGroup>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 群通知
  [CQEventType.notice](event: CQEvent<CQEventType.notice>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 全部通知
  [CQEventType.syncMessage](event: CQEvent<CQEventType.syncMessage>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 私聊消息同步
  [CQEventType.syncRead](event: CQEvent<CQEventType.syncRead>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 已读同步
  [CQEventType.guildMessage](event: CQEvent<CQEventType.guildMessage>, cqnode: CQNodeRobot) { return { ...this[''](event, cqnode) }; }, // 频道消息
  '': function commonEvent(event: CQEvent, cqnode: CQNodeRobot) {
    return {
      event,
      end: false,
      cqnode,
    };
  },
} as const;

export type EventContextBuilder<T extends CQEventType = any> = (typeof EventContextBuilderMap)[T];
export type CQNodeEventContext<T extends CQEventType = any> = CQNodeEventContextMap[T];

export default EventContextBuilderMap;
