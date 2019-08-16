import { EventName, CQEvent } from './cq-http';

declare namespace Plugin {
  type HookName = Exclude<keyof Plugin, 'onRegister' | 'cqnode'>;
  type HookDataMap  = {
    /** 接收到事件 */
    onEventReceived: {
      /** 事件名 */
      eventName: EventName;
      /** 事件Event对象 */
      event: CQEvent.Event;
    };
    /** 使用Response回复 */
    onResponse: {
  
    };
    /** 调用API */
    onRequestAPI: {
  
    };
  }
}
/** CQNode插件 */
export class Plugin {
  onRegister(): void;
}