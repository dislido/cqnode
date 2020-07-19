import Robot from './cqnode-robot';
import { CQResponse } from '../types/response';
import { CQEvent } from '../types/cq-http';
import { CQNodeModuleInf, EventReturns } from '@/types/module';
import { nullCQNode } from './util';

export default class CQNodeModule {
  static Factory: typeof ModuleFactory;
  cqnode: Robot = nullCQNode;
  isRunning = false;
  constructor(public inf: CQNodeModuleInf = {}) {}
  onRun() {}
  onStop() {}
  // @ts-ignore
  onEvent(event: CQEvent.Event, resp: CQResponse.Response): EventReturns {
    return false;
  }
  onMessage(data: CQEvent.Message, resp: CQResponse.Message): EventReturns {
    return this.onEvent(data, resp);
  }
  onPrivateMessage(data: CQEvent.PrivateMessage, resp: CQResponse.PrivateMessage): EventReturns {
    return this.onMessage(data, resp);
  }
  onGroupMessage(data: CQEvent.GroupMessage, resp: CQResponse.GroupMessage): EventReturns {
    return this.onMessage(data, resp);
  }
  onDiscussMessage(data: CQEvent.DiscussMessage, resp: CQResponse.DiscussMessage): EventReturns {
    return this.onMessage(data, resp);
  }
  onNotice(data: CQEvent.Notice, resp: CQResponse.Empty): EventReturns {
    return this.onEvent(data, resp);
  }
  onGroupUploadNotice(data: CQEvent.GroupUploadNotice, resp: CQResponse.Empty): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupAdminNotice(data: CQEvent.GroupAdminNotice, resp: CQResponse.Empty): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupDecreaseNotice(data: CQEvent.GroupDecreaseNotice, resp: CQResponse.Empty): EventReturns {
    return this.onNotice(data, resp);
  }
  onGroupIncreaseNotice(data: CQEvent.GroupIncreaseNotice, resp: CQResponse.Empty): EventReturns {
    return this.onNotice(data, resp);
  }
  onFriendAddNotice(data: CQEvent.FriendAddNotice, resp: CQResponse.Empty): EventReturns {
    return this.onNotice(data, resp);
  }
  onRequest(data: CQEvent.Request, resp: CQResponse.Request): EventReturns {
    return this.onEvent(data, resp);
  }
  onFriendRequest(data: CQEvent.FriendRequest, resp: CQResponse.FriendRequest): EventReturns {
    return this.onRequest(data, resp);
  }
  onGroupRequest(data: CQEvent.GroupRequest, resp: CQResponse.GroupRequest): EventReturns {
    return this.onRequest(data, resp);
  }

  async getFilepath() {
    if (!this.cqnode) throw new Error('在模块加载后才能使用(从onRun到onStop)');
    if (!this.inf.packageName) throw new Error('不能在匿名模块中使用此功能，在inf中添加packageName以启用此功能');
    const filepath = this.cqnode.workpath.getWorkPath(`module/${this.inf.packageName}`);
    return this.cqnode.workpath.ensurePath(filepath, null);
  }
}


export class ModuleFactory {
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
    // 清除class name
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

CQNodeModule.Factory = ModuleFactory;
