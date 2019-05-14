import CQNodeRobot from "./cqnode-robot";
import { ServerResponse } from "http";
import { CQNodeEventResponse } from "./cqnode";

function checkAtme(this: CQNodeRobot, data: CQEvent.MessageEvent) {
  Object.assign(data, {
    username: data.sender.card || data.sender.nickname,
    atme: false,
    msg: data.message.trim(),
  });
  if (data.messageType === 'private') {
    data.atme = true;
    return;
  }
  if (data.messageType !== 'group' && data.messageType !== 'discuss') return;
  const prompt = this.config.prompt instanceof Array ? this.config.prompt : [this.config.prompt];
  data.atme = prompt.some(p => {
    if (p === true && data.msg.startsWith(`[CQ:at,qq=${data.selfId}]`)) {
      data.msg = data.msg.substring(`[CQ:at,qq=${data.selfId}]`.length).trim();
      return true;
    }
    if (typeof p === 'string' && data.msg.startsWith(p)) {
      data.msg = data.msg.substring(p.length).trim();
      return true;
    }
    return false;
  });
}

type NoticeEventName = 'onGroupUploadNotice' | 'onGroupAdminNotice' | 'onGroupDecreaseNotice' | 'onGroupIncreaseNotice' | 'onFriendAddNotice';
type MessageEventName = 'onDiscussMessage' | 'onPrivateMessage' | 'onGroupMessage';
type RequestEventName = 'onFriendRequest' | 'onGroupRequest';
type EventName = NoticeEventName | MessageEventName | RequestEventName;
async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: 'onFriendAddNotice', data: CQEvent.FriendAddNoticeEvent, resp: CQNodeEventResponse.FriendAddNoticeResponse): Promise<void>;
async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: 'onGroupIncreaseNotice', data: CQEvent.GroupIncreaseNoticeEvent, resp: CQNodeEventResponse.GroupIncreaseNoticeResponse): Promise<void>;
async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: 'onGroupDecreaseNotice', data: CQEvent.GroupDecreaseNoticeEvent, resp: CQNodeEventResponse.GroupDecreaseNoticeResponse): Promise<void>;
async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: 'onGroupAdminNotice', data: CQEvent.GroupAdminNoticeEvent, resp: CQNodeEventResponse.GroupAdminNoticeResponse): Promise<void>;
async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: 'onGroupUploadNotice', data: CQEvent.GroupUploadNoticeEvent, resp: CQNodeEventResponse.GroupUploadNoticeResponse): Promise<void>;
async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: 'onDiscussMessage', data: CQEvent.DiscussMessageEvent, resp: CQNodeEventResponse.DiscussMessageResponse): Promise<void>;
async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: 'onFriendRequest', data: CQEvent.FriendRequestEvent, resp: CQNodeEventResponse.FriendRequestResponse): Promise<void>;
async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: 'onGroupRequest', data: CQEvent.GroupRequestEvent, resp: CQNodeEventResponse.GroupRequestResponse): Promise<void>;
async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: 'onPrivateMessage', data: CQEvent.PrivateMessageEvent, resp: CQNodeEventResponse.PrivateMessageResponse): Promise<void>;
async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: 'onGroupMessage', data: CQEvent.GroupMessageEvent, resp: CQNodeEventResponse.GroupMessageResponse): Promise<void>;
async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: EventName, data: any, resp: any) {
  for (let i = 0; i < cqnode.modules.length; ++i) {
    const currentModule = cqnode.modules[i];
    try {
      const result = await currentModule[eventFunctionName](data, resp);
      if (result) {
        resp.originalResponse.end(JSON.stringify(resp.responseBody));
        return;
      };
    } catch (err) {
      console.error('CQNode module error: ', err);
    }
  }
  resp.originalResponse.end();
}

function registerPrivateMessageEvent(cqnode: CQNodeRobot) {
  const getResponse = (data: CQEvent.PrivateMessageEvent, response: ServerResponse): CQNodeEventResponse.PrivateMessageResponse => ({
    originalResponse: response,
    responseBody: {},
    send(message: string) { 
      cqnode.connect.api.sendPrivateMsg(data.userId, message);
    },
    reply(message, autoEscape?) {
      this.responseBody.reply = message;
      this.responseBody.auto_escape = autoEscape;
      return this;
    },
  });
  cqnode.on('PrivateMessage', (data: CQEvent.PrivateMessageEvent, response: ServerResponse) => {
    checkAtme.call(cqnode, data);
    callModuleEvent(cqnode, 'onPrivateMessage', data, getResponse(data, response));
  });
}

function registerGroupMessageEvent(cqnode: CQNodeRobot) {
  const getResponse = (data: CQEvent.GroupMessageEvent, response: ServerResponse): CQNodeEventResponse.GroupMessageResponse => ({
    originalResponse: response,
    responseBody: {},
    send(message, autoEscape?) {
      cqnode.connect.api.sendGroupMsg(data.groupId, message, autoEscape);
    },
    reply(message, autoEscape = false) {
      this.responseBody.reply = message;
      if (autoEscape) this.responseBody.autoEscape = true;
      return this;
    },
    sendPrivate(message: string, autoEscape?) {
      cqnode.connect.api.sendPrivateMsg(data.userId, message, autoEscape)
    },
    at(at = true) {
      this.responseBody.at_sender = at;
      return this;
    },
    delete() {
      this.responseBody.delete = true;
      return this;
    },
    kick() {
      this.responseBody.kick = true;
      return this;
    },
    ban(duration: number) {
      this.responseBody.ban = true;
      this.responseBody.ban_duration = duration;
      return this;
    },
  });
  cqnode.on('GroupMessage', (data: CQEvent.GroupMessageEvent, response: ServerResponse) => {
    checkAtme.call(cqnode, data);
    callModuleEvent(cqnode, 'onGroupMessage', data, getResponse(data, response));
  });
}

function registerDiscussMessageEvent(cqnode: CQNodeRobot) {
  const getResponse = (data: CQEvent.DiscussMessageEvent, response: ServerResponse): CQNodeEventResponse.DiscussMessageResponse => ({
    originalResponse: response,
    responseBody: {},
    at(at = true) {
      this.responseBody.at_sender = at;
      return this;
    },
    reply(message, autoEscape = false) {
      this.responseBody.reply = message;
      this.responseBody.auto_escape = autoEscape;
      return this;
    },
    send(message, autoEscape) {
      cqnode.connect.api.sendDiscussMsg(data.discussId, message, autoEscape);
    }
  });
  cqnode.on('DiscussMessage', (data: CQEvent.DiscussMessageEvent, response: ServerResponse) => {
    checkAtme.call(cqnode, data);
    callModuleEvent(cqnode, 'onDiscussMessage', data, getResponse(data, response));
  });
}

function registerGroupUploadNotice(cqnode: CQNodeRobot) {
  const getResponse = (data: CQEvent.GroupUploadNoticeEvent, response: ServerResponse): CQNodeEventResponse.GroupUploadNoticeResponse => ({
    originalResponse: response,
    responseBody: {},
    send(message: string, autoEscape?: boolean) {
      cqnode.api.sendGroupMsg(data.groupId, message, autoEscape)
    },
  });
  cqnode.on('GroupUploadNotice', (data: CQEvent.GroupUploadNoticeEvent, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onGroupUploadNotice', data, getResponse(data, response));
  });
}

function registerGroupAdminNotice(cqnode: CQNodeRobot) {
  const getResponse = (data: CQEvent.GroupAdminNoticeEvent, response: ServerResponse): CQNodeEventResponse.GroupAdminNoticeResponse => ({
    originalResponse: response,
    responseBody: {},
    send(message: string, autoEscape?: boolean) {
      cqnode.api.sendGroupMsg(data.groupId, message, autoEscape)
    },
  });
  cqnode.on('GroupAdminNotice', (data: CQEvent.GroupAdminNoticeEvent, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onGroupAdminNotice', data, getResponse(data, response));
  });
}

function registerGroupDecreaseNotice(cqnode: CQNodeRobot) {
  const getResponse = (data: CQEvent.GroupDecreaseNoticeEvent, response: ServerResponse): CQNodeEventResponse.GroupDecreaseNoticeResponse => ({
    originalResponse: response,
    responseBody: {},
    send(message: string, autoEscape?: boolean) {
      cqnode.api.sendGroupMsg(data.groupId, message, autoEscape)
    },
  });
  cqnode.on('GroupDecreaseNotice', (data: CQEvent.GroupDecreaseNoticeEvent, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onGroupDecreaseNotice', data, getResponse(data, response));
  });
}

function registerGroupIncreaseNotice(cqnode: CQNodeRobot) {
  const getResponse = (data: CQEvent.GroupIncreaseNoticeEvent, response: ServerResponse): CQNodeEventResponse.GroupIncreaseNoticeResponse => ({
    originalResponse: response,
    responseBody: {},
    send(message: string, autoEscape?: boolean) {
      cqnode.api.sendGroupMsg(data.groupId, message, autoEscape)
    },
  });
  cqnode.on('GroupIncreaseNotice', (data: CQEvent.GroupIncreaseNoticeEvent, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onGroupIncreaseNotice', data, getResponse(data, response));
  });
}

function registerFriendAddNotice(cqnode: CQNodeRobot) {
  const getResponse = (data: CQEvent.FriendAddNoticeEvent, response: ServerResponse): CQNodeEventResponse.FriendAddNoticeResponse => ({
    originalResponse: response,
    responseBody: {},
    send(message: string, autoEscape?: boolean) {
      cqnode.api.sendPrivateMsg(data.userId, message, autoEscape)
    },
  });
  cqnode.on('FriendAddNotice', (data: CQEvent.FriendAddNoticeEvent, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onFriendAddNotice', data, getResponse(data, response));
  });
}

function registerFriendRequestEvent(cqnode: CQNodeRobot) {
  const getResponse = (response: ServerResponse): CQNodeEventResponse.FriendRequestResponse => ({
    originalResponse: response,
    responseBody: {},
    approve(approve, remark) {
      this.responseBody.approve = approve;
      if (remark !== undefined)this.responseBody.remark = remark;
      return this;
    },
  });
  cqnode.on('FriendRequest', (data: CQEvent.FriendRequestEvent, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onFriendRequest', data, getResponse(response));
  });
}

function registerGroupRequestEvent(cqnode: CQNodeRobot) {
  const getResponse = (response: ServerResponse): CQNodeEventResponse.GroupRequestResponse => ({
    originalResponse: response,
    responseBody: {},
    approve(approve, reason) {
      this.responseBody.approve = approve;
      if (reason !== undefined) this.responseBody.remark = reason;
      return this;
    },
  });
  cqnode.on('GroupRequest', (data: CQEvent.GroupRequestEvent, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onGroupRequest', data, getResponse(response));
  });
}

function registerLifecycleMetaEvent(cqnode: CQNodeRobot) {
  cqnode.on('LifecycleMeta', (data: CQEvent.LifecycleMetaEvent, response: ServerResponse) => {
    response.end();
  });
}

function registerHeartbeatMetaEvent(cqnode: CQNodeRobot) {
  cqnode.on('HeartbeatMeta', (data: CQEvent.HeartbeatMetaEvent, response: ServerResponse) => {
    response.end();
  });
}
export default function registerEvent(cqnode: CQNodeRobot) {
  cqnode.on('error', console.error);
  registerPrivateMessageEvent(cqnode);
  registerGroupMessageEvent(cqnode);
  registerDiscussMessageEvent(cqnode);

  registerGroupUploadNotice(cqnode);
  registerGroupAdminNotice(cqnode);
  registerGroupDecreaseNotice(cqnode);
  registerGroupIncreaseNotice(cqnode);
  registerFriendAddNotice(cqnode);

  registerFriendRequestEvent(cqnode);
  registerGroupRequestEvent(cqnode);

  registerLifecycleMetaEvent(cqnode);
  registerHeartbeatMetaEvent(cqnode);
}
