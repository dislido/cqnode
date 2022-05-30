import { EventName, CQEvent, CQAPI } from './connector';
import { ServerResponse } from 'http';
import { Module } from './module';
import { Robot } from './robot';

export type HookName = Exclude<keyof Plugin, 'onRegister' | 'cqnode'>;
export declare namespace HookData  {
  export type onEventReceived = {
    /**
     * 接收到的事件名，是下列事件名之一：
     * - `PrivateMessage`
     * - `DiscussMessage`
     * - `GroupMessage`
     * - `GroupUploadNotice`
     * - `GroupAdminNotice`
     * - `GroupDecreaseNotice`
     * - `GroupIncreaseNotice`
     * - `FriendAddNotice`
     * - `FriendRequest`
     * - `GroupRequest`
     * - `LifecycleMeta`
     * - `HeartbeatMeta`
     */
    eventName: EventName;
    /** 事件Event对象 */
    event: CQEvent.Event;
  };
  export type onResponse = {
    /** 事件Event对象 */
    event: CQEvent.Event;
    /** 原始ServerResponse对象 */
    originalResponse: ServerResponse;
    /** 将要进行响应的responseBody内容 */
    body: any;
    /** 处理该事件的Module，若为`undefined`，则没有Module处理此事件 */
    handlerModule?: Module;
  };
  export type onRequestAPI = {
    /** 调用API的模块 */
    caller: Module;
    /** 调用的API函数名 */
    apiName: keyof CQAPI;
    /** 传递给API函数的参数数组 */
    params: Parameters<CQAPI[keyof CQAPI]> & Array<any>;
    /** 替换调用的API函数 */
    function?: (...args: any) => any;
  };
}


export class Plugin {
  static Factory: typeof PluginFactory;
  cqnode: Robot;

  /** 在接收到事件时触发 */
  onEventReceived(data: HookData.onEventReceived): boolean | HookData.onEventReceived | void;
  /** 在Module响应事件时或所有Module都不处理该事件时触发  */
  onResponse(data: HookData.onResponse): boolean | HookData.onResponse | void;
  /** 在Module调用API时触发（即使用`this.cqnode.api`时） */
  onRequestAPI(data: HookData.onRequestAPI): boolean | HookData.onRequestAPI | void;
  /** CQNode初始化完毕时触发 */
  onReady(data: any): boolean | any | void;
  /** 本模块注册完成时触发 */
  onRegister(): void;
}

declare class PluginFactory {
  constructor(config?: { noDuplicate?: boolean });
  private duplicateError(name: string): void;
  createConstructor(initfn?: (...args: any) => void): typeof Plugin;
  /** 在接收到事件时触发 */
  onEventReceived(fn: (data: HookData.onEventReceived) => boolean | HookData.onEventReceived | void): this;
  /** 在Module响应事件时或所有Module都不处理该事件时触发  */
  onResponse(fn: (data: HookData.onResponse) => boolean | HookData.onResponse | void): this;
  /** 在Module调用API时触发（即使用`this.cqnode.api`时） */
  onRequestAPI(fn: (data: HookData.onRequestAPI) => boolean | HookData.onRequestAPI | void): this;
  /** 本模块注册完成时触发 */
  onRegister(): this;
}
