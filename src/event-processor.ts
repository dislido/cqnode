export interface EventProcessorOptions {
  /** 是否需要atme标识来触发，处理群/讨论组消息用（非群/讨论组消息的atme标识固定为true） */
  atme?: boolean;
}

export default class EventProcessor {
  #processorMap: Map<string, Array<[(ctx: any) => void | boolean, EventProcessorOptions]>>;
  
  /**
   * 监听指定事件；同时监听父事件时，会先执行完子事件的事件处理器；重复监听同事件时，会按监听顺序执行事件处理器；
   * @param eventName 事件名
   * @param process 事件处理器
   * @param options 额外选项
   */
  on(eventName: string, process: (ctx: any) => void | boolean, options: EventProcessorOptions = {}) {
    if (!this.#processorMap.has(eventName)) this.#processorMap.set(eventName, []);
    const processorList = this.#processorMap.get(eventName);
    processorList?.push([process, options]);
    return this;
  }

  /**
   * 接收事件
   * @param eventName 事件名
   * @param data 事件数据
   */
  async emit(eventName: string, ctx: any) {
    const evChain = eventName.split('.');

    while(evChain.length) {
      const evName = evChain.join('.');
      const processors = this.#processorMap.get(evName) ?? [];
      for (const [proc, options] of processors) {
        if (options.atme && !ctx.atme) continue;
        if (proc(ctx)) break;
      }
      evChain.pop();
    }
  }
}