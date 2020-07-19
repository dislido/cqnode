import { CQEvent } from "../../types/cq-http";

export function isMessage(event: CQEvent.Event): event is CQEvent.Message {
  return event.postType === 'message';
}
export function isNotice(event: CQEvent.Event): event is CQEvent.Notice {
  return event.postType === 'notice';
}
export function isRequest(event: CQEvent.Event): event is CQEvent.Request {
  return event.postType === 'request';
}
export function isMetaEvent(event: CQEvent.Event): event is CQEvent.Meta {
  return event.postType === 'meta_event';
}

export function isPrivateMessage(event: CQEvent.Event): event is CQEvent.PrivateMessage {
  return isMessage(event) && event.messageType === 'private';
}
export function isDiscussMessage(event: CQEvent.Event): event is CQEvent.DiscussMessage {
  return isMessage(event) && event.messageType === 'discuss';
}
export function isGroupMessage(event: CQEvent.Event): event is CQEvent.GroupMessage {
  return isMessage(event) && event.messageType === 'group';
}

export function isGroupUploadNotice(event: CQEvent.Event): event is CQEvent.GroupUploadNotice {
  return isNotice(event) && event.noticeType === 'group_upload';
}
export function isGroupAdminNotice(event: CQEvent.Event): event is CQEvent.GroupAdminNotice {
  return isNotice(event) && event.noticeType === 'group_admin';
}
export function isGroupDecreaseNotice(event: CQEvent.Event): event is CQEvent.GroupDecreaseNotice {
  return isNotice(event) && event.noticeType === 'group_decrease';
}
export function isGroupIncreaseNotice(event: CQEvent.Event): event is CQEvent.GroupIncreaseNotice {
  return isNotice(event) && event.noticeType === 'group_increase';
}
export function isFriendAddNotice(event: CQEvent.Event): event is CQEvent.FriendAddNotice {
  return isNotice(event) && event.noticeType === 'friend_add';
}

export function isFriendRequest(event: CQEvent.Event): event is CQEvent.FriendRequest {
  return isRequest(event) && event.requestType === 'friend';
}
export function isGroupRequest(event: CQEvent.Event): event is CQEvent.GroupRequest {
  return isRequest(event) && event.requestType === 'group';
}

export function isLifecycleMeta(event: CQEvent.Event): event is CQEvent.LifecycleMeta {
  return isMetaEvent(event) && event.metaEventType === 'lifecycle';
}
export function isHeartbeatMeta(event: CQEvent.Event): event is CQEvent.HeartbeatMeta {
  return isMetaEvent(event) && event.metaEventType === 'heartbeat';
}

export type EventName = 'PrivateMessage' | 'DiscussMessage' |
'GroupMessage' | 'GroupUploadNotice' | 'GroupAdminNotice' | 'GroupDecreaseNotice' | 'GroupIncreaseNotice' |
'FriendAddNotice' | 'FriendRequest' | 'GroupRequest' | 'LifecycleMeta' | 'HeartbeatMeta';

export function assertEventName(event: CQEvent.Event): EventName {
  const eventType = [
    isGroupMessage,
    isPrivateMessage,
    isDiscussMessage,
    isHeartbeatMeta,
    isGroupUploadNotice,
    isGroupAdminNotice,
    isGroupDecreaseNotice,
    isGroupIncreaseNotice,
    isFriendAddNotice,
    isFriendRequest,
    isGroupRequest,
    isLifecycleMeta,
  ].find(it => it(event));
  if (!eventType) throw new Error(`CQNode Error: unknown Event:\n${JSON.stringify(event)}`);
  return eventType.name.substr(2) as EventName;
}

export type GroupEvent = CQEvent.GroupUploadNotice | CQEvent.GroupAdminNotice | CQEvent.GroupDecreaseNotice | CQEvent.GroupIncreaseNotice | CQEvent.GroupMessage;

const groupEventNames = ['GroupUploadNotice', 'GroupAdminNotice', 'GroupDecreaseNotice', 'GroupIncreaseNotice', 'GroupMessage'];

export function isGroupEvent(event: CQEvent.Event): event is GroupEvent {
  return groupEventNames.includes(assertEventName(event));
}
