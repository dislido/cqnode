import CQNodeRobot from '../cqnode-robot';
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
  /**
   * 获取本地存储
   * @param key 存储key，默认'default'
   */
  getStorage<T = any>(key: string): Promise<T | null>;
  /**
   * 保存到本地存储
   * @param data 存储数据
   * @param key 存储key，默认'default'
   */
  setStorage(data: any, key: string): void;
  /** cqnode引用 */
  cqnode: CQNodeRobot;
}

export interface FunctionModule {
  (mod: FunctionModuleCtx, config?: any): void;
}

export interface FunctionModuleInit {
  eventProcessor: EventProcessor;
  ctx: FunctionModuleCtx;
  meta: CQNodeModuleMeta;
  onStop?(): void;
}

function getPackagePath(packageName: string) {
  return packageName.replace(/\//g, '__');
}

export async function moduleInit(fn: FunctionModule, config: any, cqnode: CQNodeRobot): Promise<FunctionModuleInit> {
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
    getStorage(key = 'default') {
      if (!meta.packageName) throw new Error('必须指定模块的packageName，使用mod.setMeta({ packageName })设置');
      return cqnode.workpathManager.readJson(`moduleStorage/${getPackagePath(meta.packageName)}/${key}.json`, null);
    },
    setStorage(data: any, key = 'default') {
      if (!meta.packageName) throw new Error('必须指定模块的packageName，使用mod.setMeta({ packageName })设置');
      return cqnode.workpathManager.writeJson(`moduleStorage/${getPackagePath(meta.packageName)}/${key}.json`, JSON.stringify(data));
    },
  };

  fn(init.ctx!, config);

  return init as FunctionModuleInit;
}
