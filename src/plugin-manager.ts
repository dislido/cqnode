import Robot from "./cqnode-robot";
import CQNodePlugin from "./robot-plugin";

type HookName = 'onEventReceived' | 'onResponse' | 'onRequestAPI';

export default class PluginManager {
  plugins: CQNodePlugin[] = [];
  constructor(public cqnode: Robot) {}

  /**
   * 注册插件
   * @param {object} plugin 插件对象
   */
  registerPlugin(plugin: CQNodePlugin) {
    if (plugin.onRegister) plugin.onRegister(this.cqnode);
    this.plugins.push(plugin);
  }

  /**
   * 触发钩子事件
   * plugin返回false或发生错误时会使事件终止
   * @param {string} hookName 钩子名
   * @param {object} data 钩子提供的参数数据对象，对该对象的修改会改变事件相关数据
   */
  emit(hookName: HookName, data: object) {
    const plugins = this.plugins.filter(plugin => plugin[hookName] === CQNodePlugin.prototype[hookName]);
    try {
      // @ts-ignore
      if (plugins.find(plugin => (plugin[hookName])(data) === false)) return false;
    } catch (e) {
      console.error(`[error]plugin error:(${hookName})`, e);
      return false;
    }
    return data;
  }
};
