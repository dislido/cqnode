import { Sendable } from 'oicq';
import CQNodeRobot from '../cqnode-robot';
import CQEventType, { CQEvent } from '../connector-oicq/event-type';
import { checkAtme } from './utils';

export const EventContextBuilderMap = {
  [CQEventType.systemLoginQrcode](event: CQEvent<CQEventType.systemLoginQrcode>) { return { event }; }, // 收到二维码
  [CQEventType.systemLoginSlider](event: CQEvent<CQEventType.systemLoginSlider>) { return { event }; }, // 滑动验证码
  [CQEventType.systemLoginDevice](event: CQEvent<CQEventType.systemLoginDevice>) { return { event }; }, // 设备锁
  [CQEventType.systemLoginError](event: CQEvent<CQEventType.systemLoginError>) { return { event }; }, // 登录错误
  [CQEventType.systemOnline](event: CQEvent<CQEventType.systemOnline>) { return { event }; }, // 上线
  [CQEventType.systemOfflineKickoff](event: CQEvent<CQEventType.systemOfflineKickoff>) { return { event }; }, // 服务器踢下线
  [CQEventType.systemOfflineNetwork](event: CQEvent<CQEventType.systemOfflineNetwork>) { return { event }; }, // 网络错误导致下线
  [CQEventType.requestFriend](event: CQEvent<CQEventType.requestFriend>) { return { event }; }, // 好友申请
  [CQEventType.requestGroupAdd](event: CQEvent<CQEventType.requestGroupAdd>) { return { event }; }, // 加群申请
  [CQEventType.requestGroupInvite](event: CQEvent<CQEventType.requestGroupInvite>) { return { event }; }, // 群邀请
  [CQEventType.request](event: CQEvent<CQEventType.request>) { return { event }; }, // 全部请求
  [CQEventType.messageGroup](event: CQEvent<CQEventType.messageGroup>, cqnode: CQNodeRobot) {
    return {
      event,
      /** 回复消息 = event.reply() */
      reply: (message: Sendable, quote?: boolean) => event.reply(message, quote),
      atme: checkAtme(event, cqnode.config.atmeTrigger, cqnode.connect.client.uin),
      /** @todo CQCode格式的string类型message */
      // msg,
      /** @todo 是否是简单文字消息（移除atmeTrigger后） */
      // isSimpleMessage,
    };
  }, // 群消息
  [CQEventType.messagePrivate](event: CQEvent<CQEventType.messagePrivate>) { return { event }; }, // 私聊消息
  [CQEventType.messageDiscuss](event: CQEvent<CQEventType.messageDiscuss>) { return { event }; }, // 讨论组消息
  [CQEventType.message](event: CQEvent<CQEventType.message>, cqnode: CQNodeRobot) {
    return {
      event,
      /** 回复消息 = event.reply() */
      reply: (message: Sendable, quote?: boolean) => event.reply(message, quote),
      atme: checkAtme(event, cqnode.config.atmeTrigger, cqnode.connect.client.uin),
      /** @todo CQCode格式的string类型message */
      // msg,
      /** @todo 是否是简单文字消息（移除atmeTrigger后） */
      // isSimpleMessage,
    };
  }, // 全部消息
  [CQEventType.noticeFriendIncrease](event: CQEvent<CQEventType.noticeFriendIncrease>) { return { event }; }, // 好友增加
  [CQEventType.noticeFriendDecrease](event: CQEvent<CQEventType.noticeFriendDecrease>) { return { event }; }, // 好友减少
  [CQEventType.noticeFriendRecall](event: CQEvent<CQEventType.noticeFriendRecall>) { return { event }; }, // 好友撤回
  [CQEventType.noticeFriendPoke](event: CQEvent<CQEventType.noticeFriendPoke>) { return { event }; }, // 好友戳一戳
  [CQEventType.noticeFriend](event: CQEvent<CQEventType.noticeFriend>) { return { event }; }, // 好友通知
  [CQEventType.noticeGroupIncrease](event: CQEvent<CQEventType.noticeGroupIncrease>) { return { event }; }, // 群员增加
  [CQEventType.noticeGroupDecrease](event: CQEvent<CQEventType.noticeGroupDecrease>) { return { event }; }, // 群员减少
  [CQEventType.noticeGroupRecall](event: CQEvent<CQEventType.noticeGroupRecall>) { return { event }; }, // 群撤回
  [CQEventType.noticeGroupPoke](event: CQEvent<CQEventType.noticeGroupPoke>) { return { event }; }, // 群戳一戳
  [CQEventType.noticeGroupBan](event: CQEvent<CQEventType.noticeGroupBan>) { return { event }; }, // 群禁言
  [CQEventType.noticeGroupAdmin](event: CQEvent<CQEventType.noticeGroupAdmin>) { return { event }; }, // 群管理变更
  [CQEventType.noticeGroupTransfer](event: CQEvent<CQEventType.noticeGroupTransfer>) { return { event }; }, // 群转让
  [CQEventType.noticeGroup](event: CQEvent<CQEventType.noticeGroup>) { return { event }; }, // 群通知
  [CQEventType.notice](event: CQEvent<CQEventType.notice>) { return { event }; }, // 全部通知
  [CQEventType.syncMessage](event: CQEvent<CQEventType.syncMessage>) { return { event }; }, // 私聊消息同步
  [CQEventType.syncRead](event: CQEvent<CQEventType.syncRead>) { return { event }; }, // 已读同步
  [CQEventType.guildMessage](event: CQEvent<CQEventType.guildMessage>) { return { event }; }, // 频道消息
} as const;

type EventContextBuilderMapType = typeof EventContextBuilderMap;
export type EventContextBuilder<T extends CQEventType = any> = (typeof EventContextBuilderMap)[T] | ((event: CQEvent<T>) => ({ event: CQEvent<T> }));
export type CQNodeEventContext<T extends CQEventType = any> = ReturnType<EventContextBuilderMapType[T]>;

export default EventContextBuilderMap;
