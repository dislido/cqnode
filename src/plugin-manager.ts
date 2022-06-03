// import CQNodeRobot from './cqnode-robot';
// import CQNodePlugin, { HookName } from './robot-plugin';

// export default class PluginManager {
//   plugins: CQNodePlugin[] = [];

//   constructor(public cqnode: CQNodeRobot) {}

//   /**
//    * 注册插件
//    * @param {object} plugin 插件对象
//    */
//   registerPlugin(plugin: CQNodePlugin) {
//     plugin.cqnode = this.cqnode;
//     plugin.onRegister();
//     this.plugins.push(plugin);
//   }

//   /**
//    * 触发钩子事件
//    * plugin返回false或发生错误时会使事件终止
//    * @param {string} hookName 钩子名
//    * @param {object} data 钩子提供的参数数据对象，对该对象的修改会改变事件相关数据
//    */
//   emit<T extends HookName>(hookName: T, data: Parameters<CQNodePlugin[T]>[0]): Parameters<CQNodePlugin[T]>[0] | false {
//     const plugins = this.plugins.filter(plugin => plugin[hookName] !== CQNodePlugin.prototype[hookName]);
//     let currData = data;
//     try {
//       if (plugins.find(plugin => {
//         const plgret = plugin[hookName](currData as any);
//         if (typeof plgret === 'object') {
//           currData = plgret as Parameters<CQNodePlugin[T]>[0];
//           return false;
//         }
//         if (plgret === undefined) return false;
//         return !plgret;
//       })) return false;
//     } catch (e) {
//       console.error(`[error]plugin error:(${hookName}) `, e);
//       return false;
//     }
//     return currData;
//   }
// }
