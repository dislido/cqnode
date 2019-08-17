import CQNodeModule, { CQNodeModuleInf, EventReturns } from './robot-module';
import { CQEvent } from '../types/cq-http';
import { CQResponse } from '../types/response';

export default class ModuleFactory {
  proto: any = {};
  noDuplicate: boolean;
  constructor({ noDuplicate = true } = {}) {
    this.noDuplicate = noDuplicate;
  }
  private duplicateError(name: string) {
    throw new Error(`ModuleFactoryError: duplicate ${name}`);
  }
  createConstructor(inf: CQNodeModuleInf = {}, initfn?: (...args: any) => void): typeof CQNodeModule {
    if (initfn instanceof Function && initfn.prototype === undefined) throw new Error('ModuleFactoryError: createConstructor的init函数不能为箭头函数');
    const proto = this.proto;
    const moduleConstructor = [class extends CQNodeModule {
      constructor(...args: any) {
        super(inf)
        Object.assign(this, proto);
        if (initfn) initfn.call(this, ...args);
      }
    }][0];
    return moduleConstructor;
  }
  onGroupMessage(fn: (data: CQEvent.GroupMessage, resp: CQResponse.GroupMessage) => EventReturns) {
    if (this.noDuplicate && this.proto.onGroupMessage) this.duplicateError('onGroupMessage');
    this.proto.onGroupMessage = fn;
    return this;
  }
  onRun(fn: () => void) {
    if (this.noDuplicate && this.proto.onGroupMessage) this.duplicateError('onRun');
    this.proto.onRun = fn;
    return this;
  }
  onStop(fn: () => void) {
    if (this.noDuplicate && this.proto.onGroupMessage) this.duplicateError('onStop');
    this.proto.onStop = fn;
    return this;
  }
  onEvent(fn: (data: CQEvent.Event, resp: CQResponse.Response) => EventReturns) {
    if (this.noDuplicate && this.proto.onEvent) this.duplicateError('onEvent');
    this.proto.onEvent = fn;
    return this;
  }
  onMessage(fn: (data: CQEvent.Message, resp: CQResponse.Message) => EventReturns) {
    if (this.noDuplicate && this.proto.onMessage) this.duplicateError('onMessage');
    this.proto.onMessage = fn;
    return this;
  }
  onPrivateMessage(fn: (data: CQEvent.PrivateMessage, resp: CQResponse.PrivateMessage) => EventReturns) {
    if (this.noDuplicate && this.proto.onPrivateMessage) this.duplicateError('onPrivateMessage');
    this.proto.onPrivateMessage = fn;
    return this;
  }
  onDiscussMessage(fn: (data: CQEvent.DiscussMessage, resp: CQResponse.DiscussMessage) => EventReturns) {
    if (this.noDuplicate && this.proto.onDiscussMessage) this.duplicateError('onDiscussMessage');
    this.proto.onDiscussMessage = fn;
    return this;
  }
  onNotice(fn: (data: CQEvent.Notice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.proto.onNotice) this.duplicateError('onNotice');
    this.proto.onNotice = fn;
    return this;
  }
  onGroupUploadNotice(fn: (data: CQEvent.GroupUploadNotice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.proto.onGroupUploadNotice) this.duplicateError('onGroupUploadNotice');
    this.proto.onGroupUploadNotice = fn;
    return this;
  }
  onGroupAdminNotice(fn: (data: CQEvent.GroupAdminNotice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.proto.onGroupAdminNotice) this.duplicateError('onGroupAdminNotice');
    this.proto.onGroupAdminNotice = fn;
    return this;
  }
  onGroupDecreaseNotice(fn: (data: CQEvent.GroupDecreaseNotice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.proto.onGroupDecreaseNotice) this.duplicateError('onGroupDecreaseNotice');
    this.proto.onGroupDecreaseNotice = fn;
    return this;
  }
  onGroupIncreaseNotice(fn: (data: CQEvent.GroupIncreaseNotice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.proto.onGroupIncreaseNotice) this.duplicateError('onGroupIncreaseNotice');
    this.proto.onGroupIncreaseNotice = fn;
    return this;
  }
  onFriendAddNotice(fn: (data: CQEvent.FriendAddNotice, resp: CQResponse.Empty) => EventReturns) {
    if (this.noDuplicate && this.proto.onFriendAddNotice) this.duplicateError('onFriendAddNotice');
    this.proto.onFriendAddNotice = fn;
    return this;
  }
  onRequest(fn: (data: CQEvent.Request, resp: CQResponse.Request) => EventReturns) {
    if (this.noDuplicate && this.proto.onRequest) this.duplicateError('onRequest');
    this.proto.onRequest = fn;
    return this;
  }
  onFriendRequest(fn: (data: CQEvent.FriendRequest, resp: CQResponse.FriendRequest) => EventReturns) {
    if (this.noDuplicate && this.proto.onFriendRequest) this.duplicateError('onFriendRequest');
    this.proto.onFriendRequest = fn;
    return this;
  }
  onGroupRequest(fn: (data: CQEvent.GroupRequest, resp: CQResponse.GroupRequest) => EventReturns) {
    if (this.noDuplicate && this.proto.onGroupRequest) this.duplicateError('onGroupRequest');
    this.proto.onGroupRequest = fn;
    return this;
  }
}
