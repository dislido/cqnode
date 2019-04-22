import { toUnderScoreCase } from '../util';

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
};
