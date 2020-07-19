import path from 'path';
import Robot from "./cqnode-robot";
import CQNodePlugin, { HookName } from "./robot-plugin";
import { LoadModuleObject } from "@/types/robot";

export default class PluginManager {
  plugins: CQNodePlugin[] = [];
  loadedPlugins: {
    [key: string]: { plugin: CQNodePlugin };
  } = {};
  constructor(public cqnode: Robot) {}

  /**
   * 注册插件
   * @param {object} plugin 插件对象
   */
  registerPlugin(plugin: LoadModuleObject) {
    const { entry, constructorParams = [] } = plugin;
    if (this.loadedPlugins[entry]) return true;
    try {
      const PluginClass = require(entry.startsWith('.') ? path.resolve(process.cwd(), entry) : entry);
      const plugin = new PluginClass(...constructorParams);
      this.loadedPlugins[entry] = { plugin };
      plugin.cqnode = this.cqnode;
      plugin.onRegister();
      this.plugins.push(plugin);
      return true;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  /**
   * 触发钩子事件
   * plugin返回false或发生错误时会使事件终止
   * @param {string} hookName 钩子名
   * @param {object} data 钩子提供的参数数据对象，对该对象的修改会改变事件相关数据
   */
  async emit<T extends HookName>(hookName: T, data: Parameters<CQNodePlugin[T]>[0]): Promise<Parameters<CQNodePlugin[T]>[0] | false> {
    const plugins = this.plugins.filter(plugin => plugin[hookName] !== CQNodePlugin.prototype[hookName]);
    let currData = data;
    try {
      for (let plugin of plugins) {
        // @ts-ignore plgret可能为promise，ts类型推断错误
        const plgret = await plugin[hookName](currData as any);
        if (typeof plgret === 'object') {
          currData = plgret as Parameters<CQNodePlugin[T]>[0];
          continue;
        }
        if (plgret === undefined) continue;
        if (!plgret) return false;
      }
    } catch (e) {
      console.error(`[error]plugin error:(${hookName}) `, e);
      return false;
    }
    return currData;
  }
};
