import CQNodeRobot from '../cqnode-robot';
import HookProcessor, { CQNodeHook, HookCallback, HookOptions } from './hook-processor';

interface CQNodePluginMeta {
  /** 插件包名，名称中不能包含无法作为文件名的字符(/除外) */
  packageName: string;
  /** 插件名 */
  name?: string;
  /** 插件帮助信息 */
  help?: string;
  /** 插件简介 */
  description?: string;
  /** 模块导出，可通过cqnode.requirePlugin(packageName)获取 */
  exports?: any;
  [key: string]: any;
}

export interface FunctionPluginCtx {
  cqnode: CQNodeRobot;
  /**
   * 监听事件
   * @param eventName 事件类型
   * @param listener 事件处理器
   * @param options 监听选项
   */
  on<T extends CQNodeHook>(eventName: T, listener: HookCallback<T>, options?: HookOptions): void;
  /**
   * 设置模块信息
   * @param inf 模块消息
   */
  setMeta(inf: CQNodePluginMeta): void;
}

export interface FunctionPluginInstance {
  hookProcessor: HookProcessor;
  ctx: FunctionPluginCtx;
  meta: CQNodePluginMeta;
}

export interface FunctionPlugin {
  (plg: FunctionPluginCtx, config?: any): void;
}

export default async function pluginInit(fn: FunctionPlugin, config: any, cqnode: CQNodeRobot): Promise<FunctionPluginInstance> {
  const hp = new HookProcessor();
  const meta = {
    name: fn.name,
    help: '无帮助信息',
    description: '无简介',
  } as CQNodePluginMeta;

  const ctx: FunctionPluginCtx = {
    cqnode,
    on(eventName, listener, options) {
      return hp.on(eventName, listener, options);
    },
    setMeta(inf: CQNodePluginMeta) {
      Object.assign(meta, inf);
    },
  };

  return {
    hookProcessor: hp,
    ctx,
    meta,
  };
}
