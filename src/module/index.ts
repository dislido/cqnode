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
  on<T extends CQEventType>(eventName: T, listener: CQEventListener<T>, options?: EventProcessorOptions): void;
  setMeta(inf: CQNodeModuleMeta): void;
}

export interface FunctionModule {
  (ctx: FunctionModuleCtx, config?: any): void;
}

export interface FunctionModuleInit {
  eventProcessor: EventProcessor;
  ctx: FunctionModuleCtx;
  meta: CQNodeModuleMeta;
}

export function moduleInit(fn: FunctionModule, config?: any): FunctionModuleInit {
  const ep = new EventProcessor();
  const meta: CQNodeModuleMeta = {
    name: fn.name,
    help: '无帮助信息',
    description: '无简介',
  };

  const ctx: FunctionModuleCtx = {
    on(eventName, listener, options) {
      return ep.on(eventName, listener, options);
    },
    setMeta(inf: CQNodeModuleMeta) {
      Object.assign(meta, inf);
    },
  };

  fn(ctx, config);

  return {
    eventProcessor: ep,
    ctx,
    meta,
  };
}
