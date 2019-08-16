import { toUnderScoreCase } from '../util';
import { CQAPI } from '../../types/cq-http';

export default {
  sendPrivateMsg(userId: number, message: string, autoEscape: boolean = false) {
    return toUnderScoreCase({ userId, message, autoEscape });
  },
  sendGroupMsg(groupId: number, message: string, autoEscape: boolean = false) {
    return toUnderScoreCase({ groupId, message, autoEscape });
  },
  sendDiscussMsg(discussId: number, message: string, autoEscape: boolean = false) {
    return toUnderScoreCase({ discussId, message, autoEscape });
  },
  sendMsg(messageType: 'private' | 'group' | 'discuss', id: number, message: string, autoEscape: boolean = false) {
    const body: any = toUnderScoreCase({ messageType, message , autoEscape });
    if (messageType === 'private') body.user_id = id;
    else if (messageType === 'group') body.group_id = id;
    else if (messageType === 'discuss') body.discuss_id = id;
    return body;
  },
  deleteMsg(messageId: number) {
    return toUnderScoreCase({ messageId });
  },
  sendLike(userId: number, times = 1) {
    return toUnderScoreCase({ userId, times });
  },
  setGroupKick(groupId: number, userId: number, rejectAddRequest = false) {
    return toUnderScoreCase({ groupId, userId, rejectAddRequest });
  },
  setGroupBan(groupId: number, userId: number, duration = 1800) {
    return toUnderScoreCase({ groupId, userId, duration });
  },
  setGroupAnonymousBan(groupId: number, anonymousFlag: string, duration = 1800) {
    return toUnderScoreCase({ groupId, anonymousFlag, duration });
  },
  setGroupWholeBan(groupId: number, enable = true) {
    return toUnderScoreCase({ groupId, enable });
  },
  setGroupAdmin(groupId: number, userId: number, enable = true) {
    return toUnderScoreCase({ groupId, userId, enable });
  },
  setGroupAnonymous(groupId: number, enable = true) {
    return toUnderScoreCase({ groupId, enable });
  },
  setGroupCard(groupId: number, userId: number, card = '') {
    return toUnderScoreCase({ groupId, userId, card });
  },
  setGroupLeave(groupId: number, isDismiss = false) {
    return toUnderScoreCase({ groupId, isDismiss });
  },
  setGroupSpecialTitle(groupId: number, userId: number, specialTitle = '', duration = -1) {
    return toUnderScoreCase({ groupId, userId, specialTitle, duration });
  },
  setDiscussLeave(discussId: number) {
    return toUnderScoreCase({ discussId });
  },
  setFriendAddRequest(flag: string, approve = true, remark = '') {
    return toUnderScoreCase({ flag, approve, remark });
  },
  setGroupAddRequest(flag: string, subType: 'add' | 'invite', approve = true, reason = '') {
    return toUnderScoreCase({ flag, subType, approve, reason });
  },
  getLoginInfo() {
    return toUnderScoreCase({  });
  },
  getStrangerInfo(userId: number, noCache = false) {
    return toUnderScoreCase({ userId, noCache });
  },
  getGroupList() {
    return toUnderScoreCase({  });
  },
  getGroupMemberInfo(groupId: number, userId: number, noCache = false) {
    return toUnderScoreCase({ groupId, userId, noCache });
  },
  getGroupMemberList(groupId: number) {
    return toUnderScoreCase({ groupId });
  },
  getCookies() {
    return toUnderScoreCase({  });
  },
  getCsrfToken() {
    return toUnderScoreCase({  });
  },
  getCredentials() {
    return toUnderScoreCase({  });
  },
  getRecord(file: string, outFormat: string, fullPath = false) {
    return toUnderScoreCase({ file, outFormat, fullPath });
  },
  getImage(file: string) {
    return toUnderScoreCase({ file });
  },
  canSendImage() {
    return toUnderScoreCase({  });
  },
  canSendRecord() {
    return toUnderScoreCase({  });
  },
  getStatus() {
    return toUnderScoreCase({  });
  },
  getVersionInfo() {
    return toUnderScoreCase({  });
  },
  setRestartPlugin(delay = 0) {
    return toUnderScoreCase({ delay });
  },
  cleanDataDir(dataDir: string) {
    return toUnderScoreCase({ dataDir });
  },
  cleanPluginLog() {
    return toUnderScoreCase({  });
  },
} as CQAPI;
