export default class PluginManager {
  plugins = [];
  constructor(public CQNode) {}

  /**
   * 注册插件
   * @param {object} plugin 插件对象
   */
  registerPlugin(plugin) {
    if (plugin.onRegister) plugin.onRegister(this.CQNode);
    this.plugins.push(plugin);
  }

  /**
   * 触发钩子事件
   * plugin返回false或发生错误时会使事件终止
   * @param {string} hookName 钩子名
   * @param {object} data 钩子提供的参数数据对象，对该对象的修改会改变事件相关数据
   */
  emit(hookName, data) {
    const plugins = this.plugins.filter(plugin => typeof plugin[hookName] === 'function');
    try {
      if (plugins.find(plugin => plugin[hookName](data) === false)) return false;
    } catch (e) {
      console.error(`[error]plugin error:(${hookName})`, e);
      return false;
    }
    return true;
  }
};
