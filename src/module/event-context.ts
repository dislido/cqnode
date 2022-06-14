import { MessageRet, Sendable } from 'oicq';
import CQNodeRobot from '../cqnode-robot';
import CQEventType, { CQEvent } from '../connector-oicq/event-type';
import { checkAtme } from './utils';
import { FunctionModuleInstance } from '.';

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
  [CQEventType.messageGroup]:
  Omit<CQNodeEventContextMap[CQEventType.message], 'eventType'> &
  commonEventContext<CQEventType.messageGroup> & {
    event: CQEvent<CQEventType.messageGroup>;
  };
  [CQEventType.messagePrivate]:
  Omit<CQNodeEventContextMap[CQEventType.message], 'eventType'> &
  commonEventContext<CQEventType.messagePrivate> & {
    event: CQEvent<CQEventType.messagePrivate>;
  }; // 私聊消息
  [CQEventType.messageDiscuss]:
  Omit<CQNodeEventContextMap[CQEventType.message], 'eventType'> &
  commonEventContext<CQEventType.messageDiscuss> & {
    event: CQEvent<CQEventType.messageDiscuss>;
  }; // 讨论组消息
  /** 全部消息 */
  [CQEventType.message]: commonEventContext<CQEventType.message> & {
    event: CQEvent<CQEventType.message>;
    /** 文本内容 */
    textMessage: string;
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
  mod: FunctionModuleInstance;
  eventType: T;
}

function commonEventContextBuilder<T extends CQEventType>(event: CQEvent<T>, mod: FunctionModuleInstance, cqnode: CQNodeRobot): commonEventContext<T> {
  return {
    event,
    end: false,
    cqnode,
    mod,
  } as commonEventContext<T>;
}

export const EventContextBuilderMap: {
  [evType in CQEventType]: (event: CQEvent, mod: FunctionModuleInstance, cqnode: CQNodeRobot) => CQNodeEventContextMap[evType];
} = {
  // 收到二维码
  [CQEventType.systemLoginQrcode](event: CQEvent<CQEventType.systemLoginQrcode>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.systemLoginQrcode>(event, mod, cqnode),
      eventType: CQEventType.systemLoginQrcode as const,
    };
  },
  // 滑动验证码
  [CQEventType.systemLoginSlider](event: CQEvent<CQEventType.systemLoginSlider>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.systemLoginSlider>(event, mod, cqnode),
      eventType: CQEventType.systemLoginSlider as const,
    };
  },
  // 设备锁
  [CQEventType.systemLoginDevice](event: CQEvent<CQEventType.systemLoginDevice>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.systemLoginDevice>(event, mod, cqnode),
      eventType: CQEventType.systemLoginDevice as const,
    };
  },
  // 登录错误
  [CQEventType.systemLoginError](event: CQEvent<CQEventType.systemLoginError>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.systemLoginError>(event, mod, cqnode),
      eventType: CQEventType.systemLoginError as const,
    };
  },
  // 上线
  [CQEventType.systemOnline](event: CQEvent<CQEventType.systemOnline>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.systemOnline>(event, mod, cqnode),
      eventType: CQEventType.systemOnline as const,
    };
  },
  // 服务器踢下线
  [CQEventType.systemOfflineKickoff](event: CQEvent<CQEventType.systemOfflineKickoff>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.systemOfflineKickoff>(event, mod, cqnode),
      eventType: CQEventType.systemOfflineKickoff as const,
    };
  },
  // 网络错误导致下线
  [CQEventType.systemOfflineNetwork](event: CQEvent<CQEventType.systemOfflineNetwork>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.systemOfflineNetwork>(event, mod, cqnode),
      eventType: CQEventType.systemOfflineNetwork as const,
    };
  },
  // 好友申请
  [CQEventType.requestFriend](event: CQEvent<CQEventType.requestFriend>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.requestFriend>(event, mod, cqnode),
      eventType: CQEventType.requestFriend as const,
    };
  },
  // 加群申请
  [CQEventType.requestGroupAdd](event: CQEvent<CQEventType.requestGroupAdd>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.requestGroupAdd>(event, mod, cqnode),
      eventType: CQEventType.requestGroupAdd as const,
    };
  },
  [CQEventType.requestGroupInvite](event: CQEvent<CQEventType.requestGroupInvite>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    const ctx = {
      ...commonEventContextBuilder<CQEventType.requestGroupInvite>(event, mod, cqnode),
      event,
      reply(approve = true) {
        ctx.end = true;
        return event.approve(approve);
      },
      eventType: CQEventType.requestGroupInvite as const,
    };
    return ctx;
  }, // 群邀请
  [CQEventType.request](event: CQEvent<CQEventType.request>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.request>(event, mod, cqnode),
      eventType: CQEventType.request as const,
    };
  }, // 全部请求
  [CQEventType.messageGroup](event: CQEvent<CQEventType.messageGroup>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...EventContextBuilderMap[CQEventType.message](event, mod, cqnode),
      event,
      eventType: CQEventType.messageGroup as const,
    };
  }, // 群消息
  [CQEventType.messagePrivate](event: CQEvent<CQEventType.messagePrivate>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...EventContextBuilderMap[CQEventType.message](event, mod, cqnode),
      event,
      atme: true,
      eventType: CQEventType.messagePrivate as const,
    };
  }, // 私聊消息
  [CQEventType.messageDiscuss](event: CQEvent<CQEventType.messageDiscuss>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...EventContextBuilderMap[CQEventType.message](event, mod, cqnode),
      event,
      eventType: CQEventType.messageDiscuss as const,
    };
  }, // 讨论组消息
  [CQEventType.message](event: CQEvent<CQEventType.message>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    const ctx = {
      ...commonEventContextBuilder<CQEventType.message>(event, mod, cqnode),
      event,
      textMessage: event.message.map(it => it.type === 'text' ? it.text : '').join('').trim(),
      /** 回复消息并结束此事件 */
      reply: (message: Sendable, quote?: boolean) => {
        ctx.end = true;
        return event.reply(message, quote);
      },
      atme: checkAtme(event, cqnode.config.atmeTrigger, cqnode.connect.client.uin),
      eventType: CQEventType.message as const,
      /** @todo CQCode格式的string类型message */
      // msg,
      /** @todo 是否是简单文字消息（移除atmeTrigger后） */
      // isSimpleMessage,
    };
    return ctx;
  }, // 全部消息
  // 好友增加
  [CQEventType.noticeFriendIncrease](event: CQEvent<CQEventType.noticeFriendIncrease>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeFriendIncrease>(event, mod, cqnode),
      eventType: CQEventType.noticeFriendIncrease as const,
    };
  },
  // 好友减少
  [CQEventType.noticeFriendDecrease](event: CQEvent<CQEventType.noticeFriendDecrease>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeFriendDecrease>(event, mod, cqnode),
      eventType: CQEventType.noticeFriendDecrease as const,
    };
  },
  // 好友撤回
  [CQEventType.noticeFriendRecall](event: CQEvent<CQEventType.noticeFriendRecall>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeFriendRecall>(event, mod, cqnode),
      eventType: CQEventType.noticeFriendRecall as const,
    };
  },
  // 好友戳一戳
  [CQEventType.noticeFriendPoke](event: CQEvent<CQEventType.noticeFriendPoke>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeFriendPoke>(event, mod, cqnode),
      eventType: CQEventType.noticeFriendPoke as const,
    };
  },
  // 好友通知
  [CQEventType.noticeFriend](event: CQEvent<CQEventType.noticeFriend>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeFriend>(event, mod, cqnode),
      eventType: CQEventType.noticeFriend as const,
    };
  },
  // 群员增加
  [CQEventType.noticeGroupIncrease](event: CQEvent<CQEventType.noticeGroupIncrease>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeGroupIncrease>(event, mod, cqnode),
      eventType: CQEventType.noticeGroupIncrease as const,
    };
  },
  // 群员减少
  [CQEventType.noticeGroupDecrease](event: CQEvent<CQEventType.noticeGroupDecrease>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeGroupDecrease>(event, mod, cqnode),
      eventType: CQEventType.noticeGroupDecrease as const,
    };
  },
  // 群撤回
  [CQEventType.noticeGroupRecall](event: CQEvent<CQEventType.noticeGroupRecall>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeGroupRecall>(event, mod, cqnode),
      eventType: CQEventType.noticeGroupRecall as const,
    };
  },
  // 群戳一戳
  [CQEventType.noticeGroupPoke](event: CQEvent<CQEventType.noticeGroupPoke>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeGroupPoke>(event, mod, cqnode),
      eventType: CQEventType.noticeGroupPoke as const,
    };
  },
  // 群禁言
  [CQEventType.noticeGroupBan](event: CQEvent<CQEventType.noticeGroupBan>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeGroupBan>(event, mod, cqnode),
      eventType: CQEventType.noticeGroupBan as const,
    };
  },
  // 群管理变更
  [CQEventType.noticeGroupAdmin](event: CQEvent<CQEventType.noticeGroupAdmin>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeGroupAdmin>(event, mod, cqnode),
      eventType: CQEventType.noticeGroupAdmin as const,
    };
  },
  // 群转让
  [CQEventType.noticeGroupTransfer](event: CQEvent<CQEventType.noticeGroupTransfer>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeGroupTransfer>(event, mod, cqnode),
      eventType: CQEventType.noticeGroupTransfer as const,
    };
  },
  // 群通知
  [CQEventType.noticeGroup](event: CQEvent<CQEventType.noticeGroup>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.noticeGroup>(event, mod, cqnode),
      eventType: CQEventType.noticeGroup as const,
    };
  },
  // 全部通知
  [CQEventType.notice](event: CQEvent<CQEventType.notice>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.notice>(event, mod, cqnode),
      eventType: CQEventType.notice as const,
    };
  },
  // 私聊消息同步
  [CQEventType.syncMessage](event: CQEvent<CQEventType.syncMessage>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.syncMessage>(event, mod, cqnode),
      eventType: CQEventType.syncMessage as const,
    };
  },
  // 已读同步
  [CQEventType.syncRead](event: CQEvent<CQEventType.syncRead>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.syncRead>(event, mod, cqnode),
      eventType: CQEventType.syncRead as const,
    };
  },
  // 频道消息
  [CQEventType.guildMessage](event: CQEvent<CQEventType.guildMessage>, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
    return {
      ...commonEventContextBuilder<CQEventType.guildMessage>(event, mod, cqnode),
      eventType: CQEventType.guildMessage as const,
    };
  },
} as const;

export type CQNodeEventContext<T extends CQEventType = CQEventType> = CQNodeEventContextMap[T];

export default EventContextBuilderMap;
