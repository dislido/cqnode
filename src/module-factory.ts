import { EventReturns, CQResponse, CQNodeModuleInf } from './cqnode';
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
  onGroupMessage(fn: (data: CQEvent.GroupMessage, resp: CQResponse.GroupMessage) => EventReturns) {
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
  onEvent(fn: (data: CQEvent.Event, resp: CQResponse.Response) => EventReturns) {
    if (this.noDuplicate && this.prototype.onEvent) this.duplicateError('onEvent');
    this.prototype.onEvent = fn;
    return this;
  }
  onMessage(fn: (data: CQEvent.Message, resp: CQResponse.Message) => EventReturns) {
    if (this.noDuplicate && this.prototype.onMessage) this.duplicateError('onMessage');
    this.prototype.onMessage = fn;
    return this;
  }
  onPrivateMessage(fn: (data: CQEvent.PrivateMessage, resp: CQResponse.PrivateMessage) => EventReturns) {
    if (this.noDuplicate && this.prototype.onPrivateMessage) this.duplicateError('onPrivateMessage');
    this.prototype.onPrivateMessage = fn;
    return this;
  }
  onDiscussMessage(fn: (data: CQEvent.DiscussMessage, resp: CQResponse.DiscussMessage) => EventReturns) {
    if (this.noDuplicate && this.prototype.onDiscussMessage) this.duplicateError('onDiscussMessage');
    this.prototype.onDiscussMessage = fn;
    return this;
  }
  onNotice(fn: (data: CQEvent.Notice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.prototype.onNotice) this.duplicateError('onNotice');
    this.prototype.onNotice = fn;
    return this;
  }
  onGroupUploadNotice(fn: (data: CQEvent.GroupUploadNotice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.prototype.onGroupUploadNotice) this.duplicateError('onGroupUploadNotice');
    this.prototype.onGroupUploadNotice = fn;
    return this;
  }
  onGroupAdminNotice(fn: (data: CQEvent.GroupAdminNotice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.prototype.onGroupAdminNotice) this.duplicateError('onGroupAdminNotice');
    this.prototype.onGroupAdminNotice = fn;
    return this;
  }
  onGroupDecreaseNotice(fn: (data: CQEvent.GroupDecreaseNotice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.prototype.onGroupDecreaseNotice) this.duplicateError('onGroupDecreaseNotice');
    this.prototype.onGroupDecreaseNotice = fn;
    return this;
  }
  onGroupIncreaseNotice(fn: (data: CQEvent.GroupIncreaseNotice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.prototype.onGroupIncreaseNotice) this.duplicateError('onGroupIncreaseNotice');
    this.prototype.onGroupIncreaseNotice = fn;
    return this;
  }
  onFriendAddNotice(fn: (data: CQEvent.FriendAddNotice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.prototype.onFriendAddNotice) this.duplicateError('onFriendAddNotice');
    this.prototype.onFriendAddNotice = fn;
    return this;
  }
  onRequest(fn: (data: CQEvent.Request, resp: CQResponse.Request) => EventReturns) {
    if (this.noDuplicate && this.prototype.onRequest) this.duplicateError('onRequest');
    this.prototype.onRequest = fn;
    return this;
  }
  onFriendRequest(fn: (data: CQEvent.FriendRequest, resp: CQResponse.FriendRequest) => EventReturns) {
    if (this.noDuplicate && this.prototype.onFriendRequest) this.duplicateError('onFriendRequest');
    this.prototype.onFriendRequest = fn;
    return this;
  }
  onGroupRequest(fn: (data: CQEvent.GroupRequest, resp: CQResponse.GroupRequest) => EventReturns) {
    if (this.noDuplicate && this.prototype.onGroupRequest) this.duplicateError('onGroupRequest');
    this.prototype.onGroupRequest = fn;
    return this;
  }
}
