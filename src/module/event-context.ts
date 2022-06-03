import { Sendable } from 'oicq';
import CQNodeRobot from '../cqnode-robot';
import CQEventType, { CQEvent } from '../connector-oicq/event-type';
import { checkAtme } from './utils';

export const EventContextBuilderMap = {
  [CQEventType.systemLoginQrcode](event: CQEvent<CQEventType.systemLoginQrcode>) { return { event, end: false }; }, // 收到二维码
  [CQEventType.systemLoginSlider](event: CQEvent<CQEventType.systemLoginSlider>) { return { event, end: false }; }, // 滑动验证码
  [CQEventType.systemLoginDevice](event: CQEvent<CQEventType.systemLoginDevice>) { return { event, end: false }; }, // 设备锁
  [CQEventType.systemLoginError](event: CQEvent<CQEventType.systemLoginError>) { return { event, end: false }; }, // 登录错误
  [CQEventType.systemOnline](event: CQEvent<CQEventType.systemOnline>) { return { event, end: false }; }, // 上线
  [CQEventType.systemOfflineKickoff](event: CQEvent<CQEventType.systemOfflineKickoff>) { return { event, end: false }; }, // 服务器踢下线
  [CQEventType.systemOfflineNetwork](event: CQEvent<CQEventType.systemOfflineNetwork>) { return { event, end: false }; }, // 网络错误导致下线
  [CQEventType.requestFriend](event: CQEvent<CQEventType.requestFriend>) { return { event, end: false }; }, // 好友申请
  [CQEventType.requestGroupAdd](event: CQEvent<CQEventType.requestGroupAdd>) { return { event, end: false }; }, // 加群申请
  [CQEventType.requestGroupInvite](event: CQEvent<CQEventType.requestGroupInvite>) { return { event, end: false }; }, // 群邀请
  [CQEventType.request](event: CQEvent<CQEventType.request>) { return { event, end: false }; }, // 全部请求
  [CQEventType.messageGroup](event: CQEvent<CQEventType.messageGroup>, cqnode: CQNodeRobot) {
    const ctx = {
      end: false,
      event,
      /** 回复消息并结束此事件 */
      reply: (message: Sendable, quote?: boolean) => {
        event.reply(message, quote);
        ctx.end = true;
      },
      atme: checkAtme(event, cqnode.config.atmeTrigger, cqnode.connect.client.uin),
      /** @todo CQCode格式的string类型message */
      // msg,
      /** @todo 是否是简单文字消息（移除atmeTrigger后） */
      // isSimpleMessage,
    };
    return ctx;
  }, // 群消息
  [CQEventType.messagePrivate](event: CQEvent<CQEventType.messagePrivate>) { return { event, end: false }; }, // 私聊消息
  [CQEventType.messageDiscuss](event: CQEvent<CQEventType.messageDiscuss>) { return { event, end: false }; }, // 讨论组消息
  [CQEventType.message](event: CQEvent<CQEventType.message>, cqnode: CQNodeRobot) {
    const ctx = {
      end: false,
      event,
      /** 回复消息并结束此事件 */
      reply: (message: Sendable, quote?: boolean) => {
        event.reply(message, quote);
        ctx.end = true;
      },
      atme: checkAtme(event, cqnode.config.atmeTrigger, cqnode.connect.client.uin),
      /** @todo CQCode格式的string类型message */
      // msg,
      /** @todo 是否是简单文字消息（移除atmeTrigger后） */
      // isSimpleMessage,
    };
    return ctx;
  }, // 全部消息
  [CQEventType.noticeFriendIncrease](event: CQEvent<CQEventType.noticeFriendIncrease>) { return { event, end: false }; }, // 好友增加
  [CQEventType.noticeFriendDecrease](event: CQEvent<CQEventType.noticeFriendDecrease>) { return { event, end: false }; }, // 好友减少
  [CQEventType.noticeFriendRecall](event: CQEvent<CQEventType.noticeFriendRecall>) { return { event, end: false }; }, // 好友撤回
  [CQEventType.noticeFriendPoke](event: CQEvent<CQEventType.noticeFriendPoke>) { return { event, end: false }; }, // 好友戳一戳
  [CQEventType.noticeFriend](event: CQEvent<CQEventType.noticeFriend>) { return { event, end: false }; }, // 好友通知
  [CQEventType.noticeGroupIncrease](event: CQEvent<CQEventType.noticeGroupIncrease>) { return { event, end: false }; }, // 群员增加
  [CQEventType.noticeGroupDecrease](event: CQEvent<CQEventType.noticeGroupDecrease>) { return { event, end: false }; }, // 群员减少
  [CQEventType.noticeGroupRecall](event: CQEvent<CQEventType.noticeGroupRecall>) { return { event, end: false }; }, // 群撤回
  [CQEventType.noticeGroupPoke](event: CQEvent<CQEventType.noticeGroupPoke>) { return { event, end: false }; }, // 群戳一戳
  [CQEventType.noticeGroupBan](event: CQEvent<CQEventType.noticeGroupBan>) { return { event, end: false }; }, // 群禁言
  [CQEventType.noticeGroupAdmin](event: CQEvent<CQEventType.noticeGroupAdmin>) { return { event, end: false }; }, // 群管理变更
  [CQEventType.noticeGroupTransfer](event: CQEvent<CQEventType.noticeGroupTransfer>) { return { event, end: false }; }, // 群转让
  [CQEventType.noticeGroup](event: CQEvent<CQEventType.noticeGroup>) { return { event, end: false }; }, // 群通知
  [CQEventType.notice](event: CQEvent<CQEventType.notice>) { return { event, end: false }; }, // 全部通知
  [CQEventType.syncMessage](event: CQEvent<CQEventType.syncMessage>) { return { event, end: false }; }, // 私聊消息同步
  [CQEventType.syncRead](event: CQEvent<CQEventType.syncRead>) { return { event, end: false }; }, // 已读同步
  [CQEventType.guildMessage](event: CQEvent<CQEventType.guildMessage>) { return { event, end: false }; }, // 频道消息
} as const;

type EventContextBuilderMapType = typeof EventContextBuilderMap;
export type EventContextBuilder<T extends CQEventType = any> = (typeof EventContextBuilderMap)[T] | ((event: CQEvent<T>) => ({ event: CQEvent<T> }));
export type CQNodeEventContext<T extends CQEventType = any> = ReturnType<EventContextBuilderMapType[T]>;

export default EventContextBuilderMap;
