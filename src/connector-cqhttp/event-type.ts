const assertField: unique symbol = Symbol('assertFieldSymbol');
interface EventTypeTree {
  [assertField] : string;
  [key: string]: string | EventTypeTree;
}
const EventTypeTree = {
  [assertField]: 'postType',
  message: {
    [assertField]: 'messageType',
    private: 'PrivateMessage',
    group: 'GroupMessage',
    discuss: 'DiscussMessage',
  },
  notice: {
    [assertField]: 'noticeType',
    group_upload: 'GroupUploadNotice',
    group_admin: 'GroupAdminNotice',
    group_decrease: 'GroupDecreaseNotice',
    group_increase: 'GroupIncreaseNotice',
    friend_add: 'FriendAddNotice',
  },
  request: {
    [assertField]: 'requestType',
    friend: 'FriendRequest',
    group: 'GroupRequest',
  },
  meta_event: {
    [assertField]: 'metaEventType',
    lifecycle: 'LifecycleMeta',
    heartbeat: 'HeartbeatMeta',
  }
};

function traversalMsgTypeAssertTree (event: CQEvent.Event, obj: EventTypeTree): string {
  const fieldName = obj[assertField];
  // @ts-ignore
  const fieldValue = event[fieldName];
  if (!fieldValue) throw new Error(`CQNode Error: unknown Event:\n${JSON.stringify(event)}`);
  if (typeof obj[fieldValue] === 'string') return obj[fieldValue] as string;
  return traversalMsgTypeAssertTree(event, obj[fieldValue] as EventTypeTree);
}

export function assertEventName(event: CQEvent.Event) {
  return traversalMsgTypeAssertTree(event, EventTypeTree);
}
