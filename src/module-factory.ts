import { EventReturns, CQNodeEventResponse, CQNodeModuleInf } from './cqnode';
import CQNodeModule from './robot-module';

export default class ModuleFactory {
  prototype: any = {};
  noDuplicate: boolean;
  constructor({ noDuplicate = true } = {}) {
    this.noDuplicate = noDuplicate;
  }
  private duplicateError(name: string) {
    throw new Error(`duplicate ${name}`);
  }
  createModule(inf: CQNodeModuleInf, initfn?: () => void) {
    const mod = Object.assign(Object.create(CQNodeModule.prototype), this.prototype) as CQNodeModule;
    mod.inf = inf;
    if (initfn) initfn.call(mod);
    return mod;
  }
  onGroupMessage(fn: (data: CQEvent.GroupMessageEvent, resp: CQNodeEventResponse.GroupMessageResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onGroupMessage) this.duplicateError('onGroupMessage');
    this.prototype.onGroupMessage = fn;
    return this;
  }
  onRun(fn: () => void) {
    if (this.noDuplicate && this.prototype.onGroupMessage) this.duplicateError('onRun');
    this.prototype.onRun = fn;
    return this;
  }
  onStop(fn: () => void) {
    if (this.noDuplicate && this.prototype.onGroupMessage) this.duplicateError('onStop');
    this.prototype.onStop = fn;
    return this;
  }
  onEvent(fn: (data: CQEvent.Event, resp: CQNodeEventResponse.Response) => EventReturns) {
    if (this.noDuplicate && this.prototype.onEvent) this.duplicateError('onEvent');
    this.prototype.onEvent = fn;
    return this;
  }
  onMessage(fn: (data: CQEvent.MessageEvent, resp: CQNodeEventResponse.MessageResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onMessage) this.duplicateError('onMessage');
    this.prototype.onMessage = fn;
    return this;
  }
  onPrivateMessage(fn: (data: CQEvent.PrivateMessageEvent, resp: CQNodeEventResponse.PrivateMessageResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onPrivateMessage) this.duplicateError('onPrivateMessage');
    this.prototype.onPrivateMessage = fn;
    return this;
  }
  onDiscussMessage(fn: (data: CQEvent.DiscussMessageEvent, resp: CQNodeEventResponse.DiscussMessageResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onDiscussMessage) this.duplicateError('onDiscussMessage');
    this.prototype.onDiscussMessage = fn;
    return this;
  }
  onNotice(fn: (data: CQEvent.NoticeEvent, resp: CQNodeEventResponse.EmptyResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onNotice) this.duplicateError('onNotice');
    this.prototype.onNotice = fn;
    return this;
  }
  onGroupUploadNotice(fn: (data: CQEvent.GroupUploadNoticeEvent, resp: CQNodeEventResponse.EmptyResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onGroupUploadNotice) this.duplicateError('onGroupUploadNotice');
    this.prototype.onGroupUploadNotice = fn;
    return this;
  }
  onGroupAdminNotice(fn: (data: CQEvent.GroupAdminNoticeEvent, resp: CQNodeEventResponse.EmptyResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onGroupAdminNotice) this.duplicateError('onGroupAdminNotice');
    this.prototype.onGroupAdminNotice = fn;
    return this;
  }
  onGroupDecreaseNotice(fn: (data: CQEvent.GroupDecreaseNoticeEvent, resp: CQNodeEventResponse.EmptyResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onGroupDecreaseNotice) this.duplicateError('onGroupDecreaseNotice');
    this.prototype.onGroupDecreaseNotice = fn;
    return this;
  }
  onGroupIncreaseNotice(fn: (data: CQEvent.GroupIncreaseNoticeEvent, resp: CQNodeEventResponse.EmptyResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onGroupIncreaseNotice) this.duplicateError('onGroupIncreaseNotice');
    this.prototype.onGroupIncreaseNotice = fn;
    return this;
  }
  onFriendAddNotice(fn: (data: CQEvent.FriendAddNoticeEvent, resp: CQNodeEventResponse.EmptyResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onFriendAddNotice) this.duplicateError('onFriendAddNotice');
    this.prototype.onFriendAddNotice = fn;
    return this;
  }
  onRequest(fn: (data: CQEvent.RequestEvent, resp: CQNodeEventResponse.RequestResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onRequest) this.duplicateError('onRequest');
    this.prototype.onRequest = fn;
    return this;
  }
  onFriendRequest(fn: (data: CQEvent.FriendRequestEvent, resp: CQNodeEventResponse.FriendRequestResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onFriendRequest) this.duplicateError('onFriendRequest');
    this.prototype.onFriendRequest = fn;
    return this;
  }
  onGroupRequest(fn: (data: CQEvent.GroupRequestEvent, resp: CQNodeEventResponse.GroupRequestResponse) => EventReturns) {
    if (this.noDuplicate && this.prototype.onGroupRequest) this.duplicateError('onGroupRequest');
    this.prototype.onGroupRequest = fn;
    return this;
  }
}
