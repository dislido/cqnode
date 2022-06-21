import { EventMap } from 'oicq';

export enum CQEventType {
  /** 收到二维码 */
  systemLoginQrcode = 'system.login.qrcode',
  /** 滑动验证码 */
  systemLoginSlider = 'system.login.slider',
  /** 设备锁 */
  systemLoginDevice = 'system.login.device',
  /** 登录错误 */
  systemLoginError = 'system.login.error',
  /** 上线 */
  systemOnline = 'system.online',
  /** 服务器踢下线 */
  systemOfflineKickoff = 'system.offline.kickoff',
  /** 网络错误导致下线 */
  systemOfflineNetwork = 'system.offline.network',
  /** 好友申请 */
  requestFriend = 'request.friend',
  /** 加群申请 */
  requestGroupAdd = 'request.group.add',
  /** 群邀请 */
  requestGroupInvite = 'request.group.invite',
  /** 全部请求 */
  request = 'request',
  /** 群消息 */
  messageGroup = 'message.group',
  /** 私聊消息 */
  messagePrivate = 'message.private',
  /** 讨论组消息 */
  messageDiscuss = 'message.discuss',
  /** 全部消息 */
  message = 'message',
  /** 好友增加 */
  noticeFriendIncrease = 'notice.friend.increase',
  /** 好友减少 */
  noticeFriendDecrease = 'notice.friend.decrease',
  /** 好友撤回 */
  noticeFriendRecall = 'notice.friend.recall',
  /** 好友戳一戳 */
  noticeFriendPoke = 'notice.friend.poke',
  /** 好友通知 */
  noticeFriend = 'notice.friend',
  /** 群员增加 */
  noticeGroupIncrease = 'notice.group.increase',
  /** 群员减少 */
  noticeGroupDecrease = 'notice.group.decrease',
  /** 群撤回 */
  noticeGroupRecall = 'notice.group.recall',
  /** 群戳一戳 */
  noticeGroupPoke = 'notice.group.poke',
  /** 群禁言 */
  noticeGroupBan = 'notice.group.ban',
  /** 群管理变更 */
  noticeGroupAdmin = 'notice.group.admin',
  /** 群转让 */
  noticeGroupTransfer = 'notice.group.transfer',
  /** 群通知 */
  noticeGroup = 'notice.group',
  /** 全部通知 */
  notice = 'notice',
  /** 私聊消息同步 */
  syncMessage = 'sync.message',
  /** 已读同步 */
  syncRead = 'sync.read',
  /** 频道消息 */
  guildMessage = 'guild.message'
}

/** 所有事件名称，不包含父事件 */
export const allLeafEventNames = [
  CQEventType.systemLoginQrcode, // 收到二维码
  CQEventType.systemLoginSlider, // 滑动验证码
  CQEventType.systemLoginDevice, // 设备锁
  CQEventType.systemLoginError, // 登录错误
  CQEventType.systemOnline, // 上线
  CQEventType.systemOfflineKickoff, // 服务器踢下线
  CQEventType.systemOfflineNetwork, // 网络错误导致下线
  CQEventType.requestFriend, // 好友申请
  CQEventType.requestGroupAdd, // 加群申请
  CQEventType.requestGroupInvite, // 群邀请
  // CQEventType.request, // 全部请求
  CQEventType.messageGroup, // 群消息
  CQEventType.messagePrivate, // 私聊消息
  CQEventType.messageDiscuss, // 讨论组消息
  // CQEventType.message, // 全部消息
  CQEventType.noticeFriendIncrease, // 好友增加
  CQEventType.noticeFriendDecrease, // 好友减少
  CQEventType.noticeFriendRecall, // 好友撤回
  CQEventType.noticeFriendPoke, // 好友戳一戳
  CQEventType.noticeFriend, // 好友通知
  CQEventType.noticeGroupIncrease, // 群员增加
  CQEventType.noticeGroupDecrease, // 群员减少
  CQEventType.noticeGroupRecall, // 群撤回
  CQEventType.noticeGroupPoke, // 群戳一戳
  CQEventType.noticeGroupBan, // 群禁言
  CQEventType.noticeGroupAdmin, // 群管理变更
  CQEventType.noticeGroupTransfer, // 群转让
  // CQEventType.noticeGroup, // 群通知
  // CQEventType.notice, // 全部通知
  CQEventType.syncMessage, // 私聊消息同步
  CQEventType.syncRead, // 已读同步
  CQEventType.guildMessage, // 频道消息
];

/** CQEventType到oicq Event的映射 */
export type CQEvent<EventName extends CQEventType = CQEventType> = Parameters<EventMap[EventName]>[0];

export default CQEventType;
