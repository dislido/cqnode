import CQNodeRobot from 'src/cqnode-robot';
import CQEventType from '../connector-oicq/event-type';
import EventProcessor, { CQEventListener, EventProcessorOptions } from './event-processor';

export interface CQNodeModuleMeta {
  /** 模块包名，应保证唯一，名称中不能包含无法作为文件名的字符，`/`会被替换为`.` */
  packageName?: string;
  /** 模块名 */
  name?: string;
  /** 模块帮助信息 */
  help?: string;
  /** 模块简介 */
  description?: string;
  [key: string]: any;
}

interface FunctionModuleCtx {
  /**
   * 监听事件
   * @param eventName 事件类型
   * @param listener 事件处理器
   * @param options 监听选项
   */
  on<T extends CQEventType>(eventName: T, listener: CQEventListener<T>, options?: EventProcessorOptions): void;
  /**
   * 设置模块信息
   * @param inf 模块消息
   */
  setMeta(inf: CQNodeModuleMeta): void;
  /**
   * 模块停止回调，多次设置会互相覆盖
   * @param cb 回调函数
   */
  onStop(cb: () => void): void;
  /** cqnode引用 */
  cqnode: CQNodeRobot;
}

export interface FunctionModule {
  (ctx: FunctionModuleCtx, config?: any): void;
}

export interface FunctionModuleInit {
  eventProcessor: EventProcessor;
  ctx: FunctionModuleCtx;
  meta: CQNodeModuleMeta;
  onStop?(): void;
}

export function moduleInit(fn: FunctionModule, config: any, cqnode: CQNodeRobot): FunctionModuleInit {
  const ep = new EventProcessor();
  const meta: CQNodeModuleMeta = {
    name: fn.name,
    help: '无帮助信息',
    description: '无简介',
  };

  const init: Partial<FunctionModuleInit> = {
    eventProcessor: ep,
    meta,
  };

  init.ctx = {
    on(eventName, listener, options) {
      return ep.on(eventName, listener, options);
    },
    setMeta(inf: CQNodeModuleMeta) {
      Object.assign(meta, inf);
    },
    onStop(cb) {
      init.onStop = cb;
    },
    cqnode,
  };

  fn(init.ctx, config);

  return init as FunctionModuleInit;
}
