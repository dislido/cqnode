import CQEventType from '../connector-oicq/event-type';
import { CQNodeEventContext } from './event-context';

export interface EventProcessorOptions {
  /** 是否需要atme标识来触发，处理群/讨论组消息用（非群/讨论组消息的ctx.atme固定为true） @todo 只有需要的事件有此option，待assertEventType()完成 */
  atme?: boolean;
}

/**
 * 事件监听函数
 */
export type CQEventListener<T extends CQEventType = any> = (ctx: CQNodeEventContext<T>) => any;

export default class EventProcessor {
  #processorMap: Map<CQEventType, Array<[CQEventListener, EventProcessorOptions]>> = new Map();

  /**
   * 监听指定事件；同时监听父事件时，会先执行完子事件的事件处理器；重复监听同事件时，会按监听顺序执行事件处理器；
   * @param eventName 事件名
   * @param process 事件处理器，返回值的Boolean值为true代表本事件处理器已处理此事件，不再传递到后续处理器（等同ctx.end置true）
   * @param options 额外选项
   */
  on<T extends CQEventType>(eventName: CQEventType, process: CQEventListener<T>, options: EventProcessorOptions = {}) {
    const opt = {
      atme: true,
      ...options,
    };
    if (!this.#processorMap.has(eventName)) this.#processorMap.set(eventName, []);
    const processorList = this.#processorMap.get(eventName);
    processorList?.push([process, opt]);
    return this;
  }

  /**
   * 接收事件
   * @param eventName 事件名
   * @param data 事件数据
   * @returns 是否结束事件处理
   */
  async emit<T extends CQEventType>(eventName: T, ctx: CQNodeEventContext<T>) {
    const evChain = eventName.split('.');
    while (evChain.length) {
      const evName = evChain.join('.') as CQEventType;
      const processors = this.#processorMap.get(evName) ?? [];
      for (const [proc, options] of processors) {
        if (options.atme && !(ctx as CQNodeEventContext<CQEventType.message>).atme) continue;
        const end = await proc(ctx);
        if (end) return true;
      }
      evChain.pop();
    }
    return false;
  }
}
