import Robot from './cqnode-robot';
import { EventName } from './connector-cqhttp/event-type';
import { ServerResponse } from 'http';
import { CQAPI, CQEvent } from '../types/cq-http';

export type HookName = Exclude<keyof CQNodePlugin, 'onRegister' | 'cqnode'>;
export type HookData  = {
  onEventReceived: {
    /** 事件名 */
    eventName: EventName;
    /** 事件Event对象 */
    event: CQEvent.Event;
  };
  onResponse: {
    originamResponse: ServerResponse;
    body: object;
  };
  onRequestAPI: {
    apiName: keyof CQAPI;
  };
};

export default class CQNodePlugin {
  cqnode: Robot;

  onEventReceived(data: HookData['onEventReceived']): false | object { return false; }
  onResponse(data: HookData['onResponse']): false | object { return false; }
  onRequestAPI(data: HookData['onRequestAPI']): false | object { return false; }

  onRegister() {}
}

export class PluginFactory {
  proto: any = {};
  noDuplicate: boolean;
  constructor({ noDuplicate = true } = {}) {
    this.noDuplicate = noDuplicate;
  }
  private duplicateError(name: string) {
    throw new Error(`ModuleFactoryError: duplicate ${name}`);
  }
  createConstructor(initfn?: (...args: any) => void): typeof CQNodePlugin {
    if (initfn instanceof Function && initfn.prototype === undefined) throw new Error('PluginFactoryError: createConstructor的init函数不能为箭头函数');
    const proto = this.proto;
    const moduleConstructor = [class extends CQNodePlugin {
      constructor(...args: any) {
        super()
        Object.assign(this, proto);
        if (initfn) initfn.call(this, ...args);
      }
    }][0];
    return moduleConstructor;
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
}
