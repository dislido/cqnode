import CQNodeRobot from "./cqnode-robot";
import { ServerResponse } from "http";
import { CQNodeEventResponse, EventResult } from "./cqnode";
import CQNodeModule from "./robot-module";

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
  const prompt = typeof this.config.prompt === 'string' ? this.config.prompt : `[CQ:at,qq=${this.config.qqid}]`;
  if (data.messageType === 'group' || data.messageType === 'discuss') {
    if (data.msg.startsWith(prompt)) {
      data.msg = data.msg.substring(prompt.length).trim(),
      data.atme = true;
    }
  }
}

async function callModuleEvent(cqnode: CQNodeRobot, exec: (currentModule: CQNodeModule) => EventResult) {
  for (let i = 0; i < cqnode.modules.length; ++i) {
    const currentModule = cqnode.modules[i];
    try {
      const result = await exec(currentModule);
      if (result) {
        if (typeof result === 'object') {
          result.originalResponse.end(JSON.stringify(result.responseBody));
        }
        return;
      };
    } catch (err) {
      console.error('CQNode module error: ', err);
    }
  }
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
  cqnode.on('PrivateMessage', async function(this: CQNodeRobot, data: CQEvent.PrivateMessageEvent, response: ServerResponse) {
    checkAtme.call(cqnode, data);
    callModuleEvent(cqnode, mod => mod.onPrivateMessage(data, getResponse(data, response)));
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
  cqnode.on('GroupMessage', async function(this: CQNodeRobot, data: CQEvent.GroupMessageEvent, response: ServerResponse) {
    checkAtme.call(cqnode, data);
    callModuleEvent(cqnode, mod => mod.onGroupMessage(data, getResponse(data, response)));
  });
}

export default function registerEvent(cqnode: CQNodeRobot) {
  registerPrivateMessageEvent(cqnode);
  registerGroupMessageEvent(cqnode);

  
}
