import path from 'path';
import CQNodeRobot from '../cqnode-robot';
import CQEventType from '../connector-oicq/event-type';
import EventProcessor, { CQEventListener, EventProcessorOptions } from './event-processor';
import { OICQAPI } from '../connector-oicq/proxy-oicq-api';
import { proxyApi } from '../util/proxy';
import { getPackagePath } from '../util/get-package-path';

export { CQNodeEventContext } from './event-context';

export interface CQNodeModuleMeta {
  /** 模块包名，名称中不能包含无法作为文件名的字符(/除外) */
  packageName: string;
  /** 模块名 */
  name?: string;
  /** 模块帮助信息 */
  help?: string;
  /** 模块简介 */
  description?: string;
  /** 模块导出，可通过cqnode.requireModule(packageName)获取 */
  exports?: any;
  [key: string]: any;
}

interface FunctionModuleCtx {
  /**
   * 监听事件
   * @param eventName 事件类型
   * @param listener 事件处理器
   * @param options 监听选项
   * @returns 取消监听函数
   */
  on<T extends CQEventType>(eventName: T, listener: CQEventListener<T>, options?: EventProcessorOptions): () => void;
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
   * @param defaultData 没有存储内容时的默认数据
   */
  getStorage<T = any>(key?: string, defaultData?: T): Promise<T>;
  /**
   * 保存到本地存储
   * @param data 存储数据
   * @param key 存储key，默认'default'
   */
  setStorage(data: any, key?: string): void;
  /** 本地存储文件夹目录 */
  storagePath: string;
  /** cqnode引用 */
  cqnode: CQNodeRobot;
  /** oicq api */
  api: OICQAPI;
}

export interface FunctionModule {
  (mod: FunctionModuleCtx, config?: any): void;
}

export interface FunctionModuleInstance {
  eventProcessor: EventProcessor;
  ctx: FunctionModuleCtx;
  meta: CQNodeModuleMeta;
  metaConfig: any;
  onStop?(): void;
}

export async function moduleInit(fn: FunctionModule, config: any, metaConfig: any, cqnode: CQNodeRobot): Promise<FunctionModuleInstance> {
  const ep = new EventProcessor();
  const meta = {
    name: fn.name,
    help: '无帮助信息',
    description: '无简介',
  } as CQNodeModuleMeta;

  const init = {
    eventProcessor: ep,
    meta,
    metaConfig,
  } as FunctionModuleInstance;

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
    api: proxyApi(cqnode.connect.api, init, cqnode),
    getStorage(key = 'default', defaultData = undefined) {
      if (!meta.packageName) throw new Error('必须先指定模块的packageName，使用mod.setMeta({ packageName })设置');
      return cqnode.workpathManager.readJson(`moduleStorage/${getPackagePath(meta.packageName)}/${key}.json`, defaultData);
    },
    setStorage(data: any, key = 'default') {
      if (!meta.packageName) throw new Error('必须先指定模块的packageName，使用mod.setMeta({ packageName })设置');
      return cqnode.workpathManager.writeJson(`moduleStorage/${getPackagePath(meta.packageName)}/${key}.json`, data);
    },
    get storagePath() {
      if (!meta.packageName) throw new Error('必须先指定模块的packageName，使用mod.setMeta({ packageName })设置');
      return path.resolve(cqnode.workpathManager.workpath, `moduleStorage/${getPackagePath(meta.packageName)}`);
    },
  };

  await fn(init.ctx!, config);
  if (!init.meta.packageName) throw new Error('必须指定模块的packageName，使用mod.setMeta({ packageName })设置');

  return init as FunctionModuleInstance;
}
