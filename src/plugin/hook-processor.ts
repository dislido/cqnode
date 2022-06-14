import CQNodeRobot from '../cqnode-robot';
import { FunctionModuleInstance } from '../module';
import CQEventType, { CQEvent } from '../connector-oicq/event-type';
import { CQNodeEventContext } from '../module/event-context';

export enum CQNodeHook {
  /** 初始化开始前，可以在此hook中替换connector和修改connector config */
  beforeInit,
  /** 事件开始处理前 */
  beforeEventProcess,
  /** 事件流转到各模块开始处理前，返回null则跳过此模块对事件处理 */
  beforeModuleEventProcess,
  /** 模块调用api前，包括通过ctx.api调用，ctx.reply等快捷调用操作，ctx.event.group.sendMsg等event下的方法调用，通过cqnode.connect.client的调用不会触发此hook */
  beforeModuleAPICall,
}

export interface HookOptions {

}

export interface CQNodeHookData {
  [CQNodeHook.beforeInit]: {
    /** connector class @todo types */
    connectorClass: any;
    /** connector config */
    connectorConfig: any;
  };
  [CQNodeHook.beforeEventProcess]: {
    /** 创建ctx，#替换可能会影响其他hook的触发 */
    ctxBuilder(event: CQEvent, mod: FunctionModuleInstance, cqnode: CQNodeRobot): any;
    /** 加载的模块 */
    mods: FunctionModuleInstance[];
    /** 事件类型 */
    eventType: CQEventType;
  };
  [CQNodeHook.beforeModuleEventProcess]: {
    readonly mod: FunctionModuleInstance;
    /** ctx */
    ctx: CQNodeEventContext;
    /** 事件类型 */
    eventType: CQEventType;
  };
  [CQNodeHook.beforeModuleAPICall]: {
    /** api名称
     * ctx.api.xxx -> xxx
     * ctx.event.xxx/ctx.xxx -> ${ctx.eventType}.xxx
     * ctx.event.group.xxx/mod.api.pickGroup().xxx -> group.xxx
     * ctx.event.member.xxx/mod.api.pickMember().xxx -> member.xxx
     */
    readonly apiName: string;
    /** api调用参数 */
    params: any;
    /** ctx */
    readonly ctx?: CQNodeEventContext;
    /** 调用者 */
    readonly mod: FunctionModuleInstance;
  };
}

export interface HookCallback<T extends CQNodeHook = CQNodeHook> {
  (data: CQNodeHookData[T]): CQNodeHookData[T];
}

export default class HookProcessor {
  #processorMap: Map<CQNodeHook, Array<[HookCallback, HookOptions]>> = new Map();

  /**
   * 监听指定事件；同时监听父事件时，会先执行完子事件的事件处理器；重复监听同事件时，会按监听顺序执行事件处理器；
   * @param eventName 事件名
   * @param process 事件处理器，返回值的Boolean值为true代表本事件处理器已处理此事件，不再传递到后续处理器（等同ctx.end置true）
   * @param options 额外选项
   */
  on<T extends CQNodeHook>(eventName: CQNodeHook, process: HookCallback<T>, options?: HookOptions) {
    const opt = {
      ...options,
    };
    if (!this.#processorMap.has(eventName)) this.#processorMap.set(eventName, []);
    const processorList = this.#processorMap.get(eventName);
    processorList?.push([process, opt]);
    return this;
  }

  /**
   * 接收事件
   * @param hookName 事件名
   * @param eventData 事件数据
   * @returns 返回事件数据，返回null则阻止事件
   */
  async emit<T extends CQNodeHook>(hookName: T, eventData: CQNodeHookData[T]) {
    const processors = this.#processorMap.get(hookName) as [HookCallback<T>, HookOptions][] ?? [];
    let currEventData = eventData;
    for (const [proc] of processors) {
      currEventData = await proc(currEventData);
      if (!currEventData) return null;
    }
    return currEventData;
  }
}
