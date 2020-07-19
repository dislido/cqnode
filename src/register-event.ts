import Robot from "./cqnode-robot";
import { ServerResponse } from "http";
import { CQEvent } from "../types/cq-http";
import { CQResponse } from "../types/response";

function unfreeze(data: CQEvent.Message) {
  ['username', 'atme', 'msg'].forEach(p => {
    if (Reflect.has(data, p)) {
      Reflect.defineProperty(data, p, { writable: true });
    }
  });
}
function checkAtme(this: Robot, data: CQEvent.Message) {
  ['username', 'atme', 'msg'].forEach(p => {
    if (Reflect.has(data, p)) {
      Reflect.defineProperty(data, p, {
        configurable: true,
        writable: false,
        value: Reflect.get(data, p),
      });
    }
  });
  Object.assign(data, {
    username: data.sender.card || data.sender.nickname,
    atme: false,
    msg: data.rawMessage.trim(),
  });
  if (data.messageType === 'private') {
    data.atme = true;
    return;
  }
  if (data.messageType !== 'group' && data.messageType !== 'discuss') return;
  const atmeTrigger = this.config.get().atmeTrigger;
  data.atme = atmeTrigger.some(p => {
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
const groupEventNames = ['onGroupUploadNotice', 'onGroupAdminNotice', 'onGroupDecreaseNotice', 'onGroupIncreaseNotice', 'onGroupMessage'];

type GroupEvent = CQEvent.GroupIncreaseNotice | CQEvent.GroupDecreaseNotice | CQEvent.GroupAdminNotice | CQEvent.GroupUploadNotice | CQEvent.GroupMessage;
type NoticeEventName = 'onGroupUploadNotice' | 'onGroupAdminNotice' | 'onGroupDecreaseNotice' | 'onGroupIncreaseNotice' | 'onFriendAddNotice';
type MessageEventName = 'onDiscussMessage' | 'onPrivateMessage' | 'onGroupMessage';
type RequestEventName = 'onFriendRequest' | 'onGroupRequest';
type EventName = NoticeEventName | MessageEventName | RequestEventName;
async function callModuleEvent(cqnode: Robot, eventFunctionName: 'onFriendAddNotice', data: CQEvent.FriendAddNotice, resp: CQResponse.FriendAddNotice): Promise<void>;
async function callModuleEvent(cqnode: Robot, eventFunctionName: 'onGroupIncreaseNotice', data: CQEvent.GroupIncreaseNotice, resp: CQResponse.GroupIncreaseNotice): Promise<void>;
async function callModuleEvent(cqnode: Robot, eventFunctionName: 'onGroupDecreaseNotice', data: CQEvent.GroupDecreaseNotice, resp: CQResponse.GroupDecreaseNotice): Promise<void>;
async function callModuleEvent(cqnode: Robot, eventFunctionName: 'onGroupAdminNotice', data: CQEvent.GroupAdminNotice, resp: CQResponse.GroupAdminNotice): Promise<void>;
async function callModuleEvent(cqnode: Robot, eventFunctionName: 'onGroupUploadNotice', data: CQEvent.GroupUploadNotice, resp: CQResponse.GroupUploadNotice): Promise<void>;
async function callModuleEvent(cqnode: Robot, eventFunctionName: 'onDiscussMessage', data: CQEvent.DiscussMessage, resp: CQResponse.DiscussMessage): Promise<void>;
async function callModuleEvent(cqnode: Robot, eventFunctionName: 'onFriendRequest', data: CQEvent.FriendRequest, resp: CQResponse.FriendRequest): Promise<void>;
async function callModuleEvent(cqnode: Robot, eventFunctionName: 'onGroupRequest', data: CQEvent.GroupRequest, resp: CQResponse.GroupRequest): Promise<void>;
async function callModuleEvent(cqnode: Robot, eventFunctionName: 'onPrivateMessage', data: CQEvent.PrivateMessage, resp: CQResponse.PrivateMessage): Promise<void>;
async function callModuleEvent(cqnode: Robot, eventFunctionName: 'onGroupMessage', data: CQEvent.GroupMessage, resp: CQResponse.GroupMessage): Promise<void>;
async function callModuleEvent(cqnode: Robot, eventFunctionName: EventName, data: CQEvent.Event, resp: CQResponse.Response) {
  const moduleCfg = cqnode.config.get().modules;
  const groupModuleCfg = groupEventNames.includes(eventFunctionName) && cqnode.groupConfig.get((<GroupEvent>data).groupId)!.modules;

  for (let i = 0; i < moduleCfg.length; ++i) {
    const globalModuleConfig = moduleCfg[i];
    const { entry: modEntry, } = globalModuleConfig;
    if (groupModuleCfg && groupModuleCfg[modEntry]) {
      if (groupModuleCfg[modEntry].enable === false) continue;
    } else if (globalModuleConfig.enable === false) {
      continue;
    };

    try {
      const currentModule = cqnode.modules[modEntry].module;
      const result = await currentModule[eventFunctionName](data as any, resp as any);
      if (result) {
        const hookData = {
          get event() { return data; },
          get originalResponse() { return resp.originalResponse; },
          body: resp.responseBody,
          get handlerModule() { return currentModule; },
        };
        const plgret = await cqnode.pluginManager.emit('onResponse', hookData)
        if (!plgret) {
          resp.originalResponse.end();
          return;
        }
        if (!resp.originalResponse.finished) resp.originalResponse.end(JSON.stringify(hookData.body));
        return;
      };
    } catch (err) {
      console.error('CQNode module error: ', err);
    }
  }
  await cqnode.pluginManager.emit('onResponse', {
    get event() { return data; },
    get originalResponse() { return resp.originalResponse; },
    body: resp.responseBody,
    get handlerModule() { return undefined; },
  })
  resp.originalResponse.end();
}

function registerPrivateMessageEvent(cqnode: Robot) {
  const getResponse = (_: CQEvent.PrivateMessage, response: ServerResponse): CQResponse.PrivateMessage => ({
    originalResponse: response,
    responseBody: {},
    reply(message, autoEscape = false) {
      this.responseBody.reply = message;
      this.responseBody.auto_escape = autoEscape;
      return this;
    },
  });
  cqnode.on('PrivateMessage', (data: CQEvent.PrivateMessage, response: ServerResponse) => {
    checkAtme.call(cqnode, data);
    unfreeze(data);
    callModuleEvent(cqnode, 'onPrivateMessage', data, getResponse(data, response));
  });
}

function registerGroupMessageEvent(cqnode: Robot) {
  const getResponse = (_: CQEvent.GroupMessage, response: ServerResponse): CQResponse.GroupMessage => ({
    originalResponse: response,
    responseBody: {},
    reply(message, autoEscape = false) {
      this.responseBody.reply = message;
      if (autoEscape) this.responseBody.auto_escape = true;
      return this;
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
  cqnode.on('GroupMessage', (data: CQEvent.GroupMessage, response: ServerResponse) => {
    checkAtme.call(cqnode, data);
    unfreeze(data);
    callModuleEvent(cqnode, 'onGroupMessage', data, getResponse(data, response));
  });
}

function registerDiscussMessageEvent(cqnode: Robot) {
  const getResponse = (_: CQEvent.DiscussMessage, response: ServerResponse): CQResponse.DiscussMessage => ({
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
  });
  cqnode.on('DiscussMessage', (data: CQEvent.DiscussMessage, response: ServerResponse) => {
    checkAtme.call(cqnode, data);
    unfreeze(data);
    callModuleEvent(cqnode, 'onDiscussMessage', data, getResponse(data, response));
  });
}

function registerGroupUploadNotice(cqnode: Robot) {
  const getResponse = (data: CQEvent.GroupUploadNotice, response: ServerResponse): CQResponse.GroupUploadNotice => ({
    originalResponse: response,
    responseBody: {},
    send(message: string, autoEscape?: boolean) {
      cqnode.api.sendGroupMsg(data.groupId, message, autoEscape);
      return this;
    },
  });
  cqnode.on('GroupUploadNotice', (data: CQEvent.GroupUploadNotice, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onGroupUploadNotice', data, getResponse(data, response));
  });
}

function registerGroupAdminNotice(cqnode: Robot) {
  const getResponse = (data: CQEvent.GroupAdminNotice, response: ServerResponse): CQResponse.GroupAdminNotice => ({
    originalResponse: response,
    responseBody: {},
    send(message: string, autoEscape?: boolean) {
      cqnode.api.sendGroupMsg(data.groupId, message, autoEscape);
      return this;
    },
  });
  cqnode.on('GroupAdminNotice', (data: CQEvent.GroupAdminNotice, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onGroupAdminNotice', data, getResponse(data, response));
  });
}

function registerGroupDecreaseNotice(cqnode: Robot) {
  const getResponse = (data: CQEvent.GroupDecreaseNotice, response: ServerResponse): CQResponse.GroupDecreaseNotice => ({
    originalResponse: response,
    responseBody: {},
    send(message: string, autoEscape?: boolean) {
      cqnode.api.sendGroupMsg(data.groupId, message, autoEscape);
      return this;
    },
  });
  cqnode.on('GroupDecreaseNotice', (data: CQEvent.GroupDecreaseNotice, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onGroupDecreaseNotice', data, getResponse(data, response));
  });
}

function registerGroupIncreaseNotice(cqnode: Robot) {
  const getResponse = (data: CQEvent.GroupIncreaseNotice, response: ServerResponse): CQResponse.GroupIncreaseNotice => ({
    originalResponse: response,
    responseBody: {},
    send(message: string, autoEscape?: boolean) {
      cqnode.api.sendGroupMsg(data.groupId, message, autoEscape);
      return this;
    },
  });
  cqnode.on('GroupIncreaseNotice', (data: CQEvent.GroupIncreaseNotice, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onGroupIncreaseNotice', data, getResponse(data, response));
  });
}

function registerFriendAddNotice(cqnode: Robot) {
  const getResponse = (data: CQEvent.FriendAddNotice, response: ServerResponse): CQResponse.FriendAddNotice => ({
    originalResponse: response,
    responseBody: {},
    send(message: string, autoEscape?: boolean) {
      cqnode.api.sendPrivateMsg(data.userId, message, autoEscape);
      return this;
    },
  });
  cqnode.on('FriendAddNotice', (data: CQEvent.FriendAddNotice, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onFriendAddNotice', data, getResponse(data, response));
  });
}

function registerFriendRequestEvent(cqnode: Robot) {
  const getResponse = (response: ServerResponse): CQResponse.FriendRequest => ({
    originalResponse: response,
    responseBody: {},
    approve(approve, remark) {
      this.responseBody.approve = approve;
      if (remark !== undefined)this.responseBody.remark = remark;
      return this;
    },
  });
  cqnode.on('FriendRequest', (data: CQEvent.FriendRequest, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onFriendRequest', data, getResponse(response));
  });
}

function registerGroupRequestEvent(cqnode: Robot) {
  const getResponse = (response: ServerResponse): CQResponse.GroupRequest => ({
    originalResponse: response,
    responseBody: {},
    approve(approve, reason) {
      this.responseBody.approve = approve;
      if (reason !== undefined) this.responseBody.remark = reason;
      return this;
    },
  });
  cqnode.on('GroupRequest', (data: CQEvent.GroupRequest, response: ServerResponse) => {
    callModuleEvent(cqnode, 'onGroupRequest', data, getResponse(response));
  });
}

function registerLifecycleMetaEvent(cqnode: Robot) {
  cqnode.on('LifecycleMeta', (_: CQEvent.LifecycleMeta, response: ServerResponse) => {
    response.end();
  });
}

function registerHeartbeatMetaEvent(cqnode: Robot) {
  cqnode.on('HeartbeatMeta', (_: CQEvent.HeartbeatMeta, response: ServerResponse) => {
    response.end();
  });
}
export default function registerEvent(cqnode: Robot) {
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
