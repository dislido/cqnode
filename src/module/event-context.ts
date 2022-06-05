import { MessageRet, Sendable } from 'oicq';
import CQNodeRobot from '../cqnode-robot';
import CQEventType, { CQEvent } from '../connector-oicq/event-type';
import { checkAtme } from './utils';

/** @todo */
export interface CQNodeEventContextMap {
  [CQEventType.systemLoginQrcode]: commonEventContext<CQEventType.systemLoginQrcode>; // 收到二维码
  [CQEventType.systemLoginSlider]: commonEventContext<CQEventType.systemLoginSlider>; // 滑动验证码
  [CQEventType.systemLoginDevice]: commonEventContext<CQEventType.systemLoginDevice>; // 设备锁
  [CQEventType.systemLoginError]: commonEventContext<CQEventType.systemLoginError>; // 登录错误
  [CQEventType.systemOnline]: commonEventContext<CQEventType.systemOnline>; // 上线
  [CQEventType.systemOfflineKickoff]: commonEventContext<CQEventType.systemOfflineKickoff>; // 服务器踢下线
  [CQEventType.systemOfflineNetwork]: commonEventContext<CQEventType.systemOfflineNetwork>; // 网络错误导致下线
  [CQEventType.requestFriend]: commonEventContext<CQEventType.requestFriend>; // 好友申请
  [CQEventType.requestGroupAdd]: commonEventContext<CQEventType.requestGroupAdd>; // 加群申请
  /** 群邀请 */
  [CQEventType.requestGroupInvite]: commonEventContext<CQEventType.requestGroupInvite> & {
    event: CQEvent<CQEventType.requestGroupInvite>;
    /**
     * 处理请求并结束处理事件
     * @param approve 是否同意入群
     */
    reply(approve?: boolean): Promise<boolean>;
  };
  [CQEventType.request]: commonEventContext<CQEventType.request>; // 全部请求
  /** 群消息 */
  [CQEventType.messageGroup]: CQNodeEventContextMap[CQEventType.message] & {
    event: CQEvent<CQEventType.messageGroup>;
  };
  [CQEventType.messagePrivate]: commonEventContext<CQEventType.messagePrivate>; // 私聊消息
  [CQEventType.messageDiscuss]: commonEventContext<CQEventType.messageDiscuss>; // 讨论组消息
  /** 全部消息 */
  [CQEventType.message]: commonEventContext<CQEventType.message> & {
    event: CQEvent<CQEventType.message>;
    /**
     * 回复消息并结束处理事件
     * @param message 回复内容
     * @param quote 是否引用
     */
    reply(message: Sendable, quote?: boolean): Promise<MessageRet>;
    /** 群/讨论组消息中是否命中atmeTrigger判断，私聊消息中固定为true */
    atme: boolean;
  };
  [CQEventType.noticeFriendIncrease]: commonEventContext<CQEventType.noticeFriendIncrease>; // 好友增加
  [CQEventType.noticeFriendDecrease]: commonEventContext<CQEventType.noticeFriendDecrease>; // 好友减少
  [CQEventType.noticeFriendRecall]: commonEventContext<CQEventType.noticeFriendRecall>; // 好友撤回
  [CQEventType.noticeFriendPoke]: commonEventContext<CQEventType.noticeFriendPoke>; // 好友戳一戳
  [CQEventType.noticeFriend]: commonEventContext<CQEventType.noticeFriend>; // 好友通知
  [CQEventType.noticeGroupIncrease]: commonEventContext<CQEventType.noticeGroupIncrease>; // 群员增加
  [CQEventType.noticeGroupDecrease]: commonEventContext<CQEventType.noticeGroupDecrease>; // 群员减少
  [CQEventType.noticeGroupRecall]: commonEventContext<CQEventType.noticeGroupRecall>; // 群撤回
  [CQEventType.noticeGroupPoke]: commonEventContext<CQEventType.noticeGroupPoke>; // 群戳一戳
  [CQEventType.noticeGroupBan]: commonEventContext<CQEventType.noticeGroupBan>; // 群禁言
  [CQEventType.noticeGroupAdmin]: commonEventContext<CQEventType.noticeGroupAdmin>; // 群管理变更
  [CQEventType.noticeGroupTransfer]: commonEventContext<CQEventType.noticeGroupTransfer>; // 群转让
  [CQEventType.noticeGroup]: commonEventContext<CQEventType.noticeGroup>; // 群通知
  [CQEventType.notice]: commonEventContext<CQEventType.notice>; // 全部通知
  [CQEventType.syncMessage]: commonEventContext<CQEventType.syncMessage>; // 私聊消息同步
  [CQEventType.syncRead]: commonEventContext<CQEventType.syncRead>; // 已读同步
  [CQEventType.guildMessage]: commonEventContext<CQEventType.guildMessage>; // 频道消息
}

interface commonEventContext<T extends CQEventType> {
  event: CQEvent<T>;
  end: boolean;
  cqnode: CQNodeRobot;
}

function commonEventContextBuilder<T extends CQEventType>(event: CQEvent<T>, cqnode: CQNodeRobot): commonEventContext<T> {
  return {
    event,
    end: false,
    cqnode,
  };
}

export const EventContextBuilderMap: {
  [evType in CQEventType]: (event: CQEvent, cqnode: CQNodeRobot) => CQNodeEventContextMap[evType];
} = {
  [CQEventType.systemLoginQrcode](event: CQEvent<CQEventType.systemLoginQrcode>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.systemLoginQrcode>(event, cqnode) }; }, // 收到二维码
  [CQEventType.systemLoginSlider](event: CQEvent<CQEventType.systemLoginSlider>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.systemLoginSlider>(event, cqnode) }; }, // 滑动验证码
  [CQEventType.systemLoginDevice](event: CQEvent<CQEventType.systemLoginDevice>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.systemLoginDevice>(event, cqnode) }; }, // 设备锁
  [CQEventType.systemLoginError](event: CQEvent<CQEventType.systemLoginError>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.systemLoginError>(event, cqnode) }; }, // 登录错误
  [CQEventType.systemOnline](event: CQEvent<CQEventType.systemOnline>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.systemOnline>(event, cqnode) }; }, // 上线
  [CQEventType.systemOfflineKickoff](event: CQEvent<CQEventType.systemOfflineKickoff>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.systemOfflineKickoff>(event, cqnode) }; }, // 服务器踢下线
  [CQEventType.systemOfflineNetwork](event: CQEvent<CQEventType.systemOfflineNetwork>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.systemOfflineNetwork>(event, cqnode) }; }, // 网络错误导致下线
  [CQEventType.requestFriend](event: CQEvent<CQEventType.requestFriend>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.requestFriend>(event, cqnode) }; }, // 好友申请
  [CQEventType.requestGroupAdd](event: CQEvent<CQEventType.requestGroupAdd>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.requestGroupAdd>(event, cqnode) }; }, // 加群申请
  [CQEventType.requestGroupInvite](event: CQEvent<CQEventType.requestGroupInvite>, cqnode: CQNodeRobot) {
    const ctx = {
      ...commonEventContextBuilder<CQEventType.requestGroupInvite>(event, cqnode),
      event,
      reply(approve = true) {
        ctx.end = true;
        return event.approve(approve);
      },
    };
    return ctx;
  }, // 群邀请
  [CQEventType.request](event: CQEvent<CQEventType.request>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.request>(event, cqnode) }; }, // 全部请求
  [CQEventType.messageGroup](event: CQEvent<CQEventType.messageGroup>, cqnode: CQNodeRobot) {
    return {
      ...EventContextBuilderMap[CQEventType.message](event, cqnode),
      event,
    };
  }, // 群消息
  [CQEventType.messagePrivate](event: CQEvent<CQEventType.messagePrivate>, cqnode: CQNodeRobot) { return { ...EventContextBuilderMap[CQEventType.message](event, cqnode), event, atme: true }; }, // 私聊消息
  [CQEventType.messageDiscuss](event: CQEvent<CQEventType.messageDiscuss>, cqnode: CQNodeRobot) { return { ...EventContextBuilderMap[CQEventType.message](event, cqnode), event }; }, // 讨论组消息
  [CQEventType.message](event: CQEvent<CQEventType.message>, cqnode: CQNodeRobot) {
    const ctx = {
      ...commonEventContextBuilder<CQEventType.message>(event, cqnode),
      event,
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
  [CQEventType.noticeFriendIncrease](event: CQEvent<CQEventType.noticeFriendIncrease>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeFriendIncrease>(event, cqnode) }; }, // 好友增加
  [CQEventType.noticeFriendDecrease](event: CQEvent<CQEventType.noticeFriendDecrease>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeFriendDecrease>(event, cqnode) }; }, // 好友减少
  [CQEventType.noticeFriendRecall](event: CQEvent<CQEventType.noticeFriendRecall>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeFriendRecall>(event, cqnode) }; }, // 好友撤回
  [CQEventType.noticeFriendPoke](event: CQEvent<CQEventType.noticeFriendPoke>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeFriendPoke>(event, cqnode) }; }, // 好友戳一戳
  [CQEventType.noticeFriend](event: CQEvent<CQEventType.noticeFriend>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeFriend>(event, cqnode) }; }, // 好友通知
  [CQEventType.noticeGroupIncrease](event: CQEvent<CQEventType.noticeGroupIncrease>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeGroupIncrease>(event, cqnode) }; }, // 群员增加
  [CQEventType.noticeGroupDecrease](event: CQEvent<CQEventType.noticeGroupDecrease>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeGroupDecrease>(event, cqnode) }; }, // 群员减少
  [CQEventType.noticeGroupRecall](event: CQEvent<CQEventType.noticeGroupRecall>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeGroupRecall>(event, cqnode) }; }, // 群撤回
  [CQEventType.noticeGroupPoke](event: CQEvent<CQEventType.noticeGroupPoke>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeGroupPoke>(event, cqnode) }; }, // 群戳一戳
  [CQEventType.noticeGroupBan](event: CQEvent<CQEventType.noticeGroupBan>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeGroupBan>(event, cqnode) }; }, // 群禁言
  [CQEventType.noticeGroupAdmin](event: CQEvent<CQEventType.noticeGroupAdmin>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeGroupAdmin>(event, cqnode) }; }, // 群管理变更
  [CQEventType.noticeGroupTransfer](event: CQEvent<CQEventType.noticeGroupTransfer>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeGroupTransfer>(event, cqnode) }; }, // 群转让
  [CQEventType.noticeGroup](event: CQEvent<CQEventType.noticeGroup>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.noticeGroup>(event, cqnode) }; }, // 群通知
  [CQEventType.notice](event: CQEvent<CQEventType.notice>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.notice>(event, cqnode) }; }, // 全部通知
  [CQEventType.syncMessage](event: CQEvent<CQEventType.syncMessage>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.syncMessage>(event, cqnode) }; }, // 私聊消息同步
  [CQEventType.syncRead](event: CQEvent<CQEventType.syncRead>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.syncRead>(event, cqnode) }; }, // 已读同步
  [CQEventType.guildMessage](event: CQEvent<CQEventType.guildMessage>, cqnode: CQNodeRobot) { return { ...commonEventContextBuilder<CQEventType.guildMessage>(event, cqnode) }; }, // 频道消息
} as const;

export type EventContextBuilder<T extends CQEventType = any> = (typeof EventContextBuilderMap)[T];
export type CQNodeEventContext<T extends CQEventType = any> = CQNodeEventContextMap[T];

export default EventContextBuilderMap;
