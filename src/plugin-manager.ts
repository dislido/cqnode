import Robot from "./cqnode-robot";
import CQNodePlugin from "./robot-plugin";
import { Plugin } from './cqnode';

export default class PluginManager {
  plugins: CQNodePlugin[] = [];
  constructor(public cqnode: Robot) {}

  /**
   * 注册插件
   * @param {object} plugin 插件对象
   */
  registerPlugin(plugin: CQNodePlugin) {
    plugin.cqnode = this.cqnode;
    plugin.onRegister();
    this.plugins.push(plugin);
  }

  /**
   * 触发钩子事件
   * plugin返回false或发生错误时会使事件终止
   * @param {string} hookName 钩子名
   * @param {object} data 钩子提供的参数数据对象，对该对象的修改会改变事件相关数据
   */
  emit<T extends Plugin.HookName>(hookName: T, data: Plugin.HookDataMap[T]) {
    const plugins = this.plugins.filter(plugin => plugin[hookName] !== CQNodePlugin.prototype[hookName]);
    try {
      if (plugins.find(plugin => plugin[hookName](data) === false)) return false;
    } catch (e) {
      console.error(`[error]plugin error:(${hookName}) `, e);
      return false;
    }
    return data;
  }
};
