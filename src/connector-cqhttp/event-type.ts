const assertField: unique symbol = Symbol('assertFieldSymbol');
interface EventTypeTree {
  [assertField] : string;
  [key: string]: string | EventTypeTree;
}
const EventTypeTree = {
  [assertField]: 'post_type',
  message: {
    [assertField]: 'message_type',
    group: 'GroupMessage',
    private: 'PrivateMessage',
    discuss: 'DiscussMessage',
  },
  notice: {
    [assertField]: 'notice_type',
    group_upload: 'GroupUploadNotice',
    group_admin: 'GroupAdminNotice',
    group_decrease: 'GroupDecreaseNotice',
    group_increase: 'GroupIncreaseNotice',
    friend_add: 'FriendAddNotice',
  },
  request: {
    [assertField]: 'request_type',
    friend: 'FriendRequest',
    group: 'GroupRequest',
  },
  meta_event: {
    [assertField]: 'meta_event_type',
    lifecycle: 'LifecycleMeta',
    heartbeat: 'HeartbeatMeta',
  }
};

function traversalMsgTypeAssertTree (event: CQEvent.Event, obj: EventTypeTree): string {
  const fieldName = obj[assertField];
  // @ts-ignore
  const fieldValue = event[fieldName];
  if (!fieldValue) throw new Error(`CQNode Error: unknown Event:\n${JSON.stringify(event)}`);
  if (typeof fieldValue === 'function') return fieldValue;
  return traversalMsgTypeAssertTree(event, fieldValue);
}

export function assertEventName(event: CQEvent.Event) {
  return traversalMsgTypeAssertTree(event, EventTypeTree);
}
