import Robot from './cqnode-robot';
import { EventName } from './connector-cqhttp/event-type';
import { ServerResponse } from 'http';
import CQNodeModule from './robot-module';
import { CQAPI, CQEvent } from '../types/cq-http';
import { OptionalPromisify } from '@/types/type';

export type HookName = Exclude<keyof CQNodePlugin, 'onRegister' | 'cqnode'>;
namespace HookData  {
  export type onEventReceived = {
    /** 事件名 */
    eventName: EventName;
    /** 事件Event对象 */
    event: CQEvent.Event;
  };
  export type onResponse = {
    event: CQEvent.Event;
    /** 原始ServerResponse对象 */
    originalResponse: ServerResponse;
    /** 将要进行响应的responseBody内容 */
    body: {
      [field: string]: any;
    };
    /** 处理此消息的Module,若为空则没有模块处理此消息 */
    handlerModule?: CQNodeModule;
  };
  export type onRequestAPI = {
    /** 请求API的Module */
    caller: CQNodeModule;
    apiName: keyof CQAPI;
    params: Parameters<CQAPI[keyof CQAPI]>;
    function?: Function;
  };
};

export default class CQNodePlugin {
  static Factory: typeof PluginFactory;
  cqnode: Robot;

  /** 在接收到事件时触发 */
  onEventReceived(data: HookData.onEventReceived): OptionalPromisify<boolean | HookData.onEventReceived | void> { return data; }
  /** 无论返回什么，response.end()都会被调用，handlerModule存在时，返回false会阻止cqnode返回任何数据，即无视body内容 */
  onResponse(data: HookData.onResponse): OptionalPromisify<boolean | HookData.onResponse | void> { return data; }
  /** 拦截Module对API的调用，不影响Plugin的API调用 */
  onRequestAPI(data: HookData.onRequestAPI): OptionalPromisify<boolean | HookData.onRequestAPI | void> { return data; }
  /** CQNode初始化完毕时触发 */
  onReady(data: {}): boolean | {} | void { return data; }

  onRegister() {}
}

export class PluginFactory {
  proto: any = {};
  noDuplicate: boolean;
  constructor({ noDuplicate = true } = {}) {
    this.noDuplicate = noDuplicate;
  }
  private duplicateError(name: string) {
    throw new Error(`PluginFactoryError: duplicate ${name}`);
  }
  createConstructor(initfn?: (...args: any) => void): typeof CQNodePlugin {
    if (initfn instanceof Function && initfn.prototype === undefined) throw new Error('PluginFactoryError: createConstructor的init函数不能为箭头函数');
    const proto = this.proto;
    const pluginConstructor = [class extends CQNodePlugin {
      constructor(...args: any) {
        super()
        Object.assign(this, proto);
        if (initfn) initfn.call(this, ...args);
      }
    }][0];
    return pluginConstructor;
  }
  onEventReceived(fn: (data: HookData.onEventReceived) => boolean | HookData.onEventReceived | void) {
    if (this.noDuplicate && this.proto.onEventReceived) this.duplicateError('onEventReceived');
    this.proto.onEventReceived = fn;
    return this;
  }
  onResponse(fn: (data: HookData.onResponse) => boolean | HookData.onResponse | void) {
    if (this.noDuplicate && this.proto.onResponse) this.duplicateError('onResponse');
    this.proto.onResponse = fn;
    return this;
  }
  onRequestAPI(fn: (data: HookData.onRequestAPI) => boolean | HookData.onRequestAPI | void) {
    if (this.noDuplicate && this.proto.onRequestAPI) this.duplicateError('onRequestAPI');
    this.proto.onRequestAPI = fn;
    return this;
  }
  onRegister(fn: () => void) {
    if (this.noDuplicate && this.proto.onRegister) this.duplicateError('onRegister');
    this.proto.onRegister = fn;
    return this;
  }
}

CQNodePlugin.Factory = PluginFactory;
