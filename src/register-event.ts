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
  const prompt = typeof this.config.prompt === 'string' ? this.config.prompt : `[CQ:at,qq=${data.selfId}]`;
  if (data.messageType === 'group' || data.messageType === 'discuss') {
    if (data.msg.startsWith(prompt)) {
      data.msg = data.msg.substring(prompt.length).trim(),
      data.atme = true;
    }
  }
}

const getEmptyResponse = (response: ServerResponse) => ({
  originalResponse: response,
  responseBody: {},
});

async function callModuleEvent(cqnode: CQNodeRobot, eventFunctionName: string, data: CQEvent.Event, resp: CQNodeEventResponse.Response) {
  for (let i = 0; i < cqnode.modules.length; ++i) {
    const currentModule = cqnode.modules[i];
    try {
      // @ts-ignore 保证传递正确的类型
      const result = await currentModule[eventFunctionName](data, resp);
      if (result) {
        if (typeof result === 'object') {
          result.originalResponse.end(JSON.stringify(result.responseBody));
        }
        else resp.originalResponse.end();
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
  cqnode.on('PrivateMessage', async (data: CQEvent.PrivateMessageEvent, response: ServerResponse) => {
    checkAtme.call(cqnode, data);
    await callModuleEvent(cqnode, 'onPrivateMessage', data, getResponse(data, response));
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
  cqnode.on('GroupMessage', async (data: CQEvent.GroupMessageEvent, response: ServerResponse) => {
    checkAtme.call(cqnode, data);
    await callModuleEvent(cqnode, 'onGroupMessage', data, getResponse(data, response));
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
  cqnode.on('DiscussMessage', async (data: CQEvent.DiscussMessageEvent, response: ServerResponse) => {
    checkAtme.call(cqnode, data);
    await callModuleEvent(cqnode, 'onDiscussMessage', data, getResponse(data, response));
  });
}

function registerNoticeEvent(cqnode: CQNodeRobot, eventName: string) {
  cqnode.on(eventName, async (data: CQEvent.NoticeEvent, response: ServerResponse) => {
    await callModuleEvent(cqnode, `on${eventName}`, data, getEmptyResponse(response));
  })
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
  cqnode.on('FriendRequest', async (data: CQEvent.FriendRequestEvent, response: ServerResponse) => {
    await callModuleEvent(cqnode, 'onFriendRequest', data, getResponse(response));
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
  cqnode.on('GroupRequest', async (data: CQEvent.GroupRequestEvent, response: ServerResponse) => {
    await callModuleEvent(cqnode, 'onGroupRequest', data, getResponse(response));
  });
}

function registerLifecycleMetaEvent(cqnode: CQNodeRobot) {
  cqnode.on('LifecycleMeta', async (data: CQEvent.LifecycleMetaEvent, response: ServerResponse) => {
    response.end();
  });
}

function registerHeartbeatMetaEvent(cqnode: CQNodeRobot) {
  cqnode.on('HeartbeatMeta', async (data: CQEvent.HeartbeatMetaEvent, response: ServerResponse) => {
    response.end();
  });
}
export default function registerEvent(cqnode: CQNodeRobot) {
  cqnode.on('error', console.error);
  registerPrivateMessageEvent(cqnode);
  registerGroupMessageEvent(cqnode);
  registerDiscussMessageEvent(cqnode);

  registerNoticeEvent(cqnode, 'GroupUploadNotice');
  registerNoticeEvent(cqnode, 'GroupAdminNotice');
  registerNoticeEvent(cqnode, 'GroupDecreaseNotice');
  registerNoticeEvent(cqnode, 'GroupIncreaseNotice');
  registerNoticeEvent(cqnode, 'FriendAddNotice');

  registerFriendRequestEvent(cqnode);
  registerGroupRequestEvent(cqnode);

  registerLifecycleMetaEvent(cqnode);
  registerHeartbeatMetaEvent(cqnode);
}
