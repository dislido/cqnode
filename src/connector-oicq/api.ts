export default {
  sendPrivateMsg(userId: number, message: string, autoEscape = false) {
    return { userId, message, autoEscape };
  },
  sendGroupMsg(groupId: number, message: string, autoEscape = false) {
    return { groupId, message, autoEscape };
  },
  sendDiscussMsg(discussId: number, message: string, autoEscape = false) {
    return { discussId, message, autoEscape };
  },
  sendMsg(messageType: 'private' | 'group' | 'discuss', id: number, message: string, autoEscape = false) {
    const body: any = { messageType, message , autoEscape };
    if (messageType === 'private') body.user_id = id;
    else if (messageType === 'group') body.group_id = id;
    else if (messageType === 'discuss') body.discuss_id = id;
    return body;
  },
  deleteMsg(messageId: number) {
    return { messageId };
  },
  sendLike(userId: number, times = 1) {
    return { userId, times };
  },
  setGroupKick(groupId: number, userId: number, rejectAddRequest = false) {
    return { groupId, userId, rejectAddRequest };
  },
  setGroupBan(groupId: number, userId: number, duration = 1800) {
    return { groupId, userId, duration };
  },
  setGroupAnonymousBan(groupId: number, anonymousFlag: string, duration = 1800) {
    return { groupId, anonymousFlag, duration };
  },
  setGroupWholeBan(groupId: number, enable = true) {
    return { groupId, enable };
  },
  setGroupAdmin(groupId: number, userId: number, enable = true) {
    return { groupId, userId, enable };
  },
  setGroupAnonymous(groupId: number, enable = true) {
    return { groupId, enable };
  },
  setGroupCard(groupId: number, userId: number, card = '') {
    return { groupId, userId, card };
  },
  setGroupLeave(groupId: number, isDismiss = false) {
    return { groupId, isDismiss };
  },
  setGroupSpecialTitle(groupId: number, userId: number, specialTitle = '', duration = -1) {
    return { groupId, userId, specialTitle, duration };
  },
  setDiscussLeave(discussId: number) {
    return { discussId };
  },
  setFriendAddRequest(flag: string, approve = true, remark = '') {
    return { flag, approve, remark };
  },
  setGroupAddRequest(flag: string, subType: 'add' | 'invite', approve = true, reason = '') {
    return { flag, subType, approve, reason };
  },
  getLoginInfo() {
    return {};
  },
  getStrangerInfo(userId: number, noCache = false) {
    return { userId, noCache };
  },
  getGroupList() {
    return {};
  },
  getGroupMemberInfo(groupId: number, userId: number, noCache = false) {
    return { groupId, userId, noCache };
  },
  getGroupMemberList(groupId: number) {
    return { groupId };
  },
  getCookies() {
    return {};
  },
  getCsrfToken() {
    return {};
  },
  getCredentials() {
    return {};
  },
  getRecord(file: string, outFormat: string, fullPath = false) {
    return { file, outFormat, fullPath };
  },
  getImage(file: string) {
    return { file };
  },
  canSendImage() {
    return {};
  },
  canSendRecord() {
    return {};
  },
  getStatus() {
    return {};
  },
  getVersionInfo() {
    return {};
  },
  setRestartPlugin(delay = 0) {
    return { delay };
  },
  cleanDataDir(dataDir: string) {
    return { dataDir };
  },
  cleanPluginLog() {
    return {};
  },
};
