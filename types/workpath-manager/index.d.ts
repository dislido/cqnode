import { Module } from '../module';
import JsonStorage from './json-storage';

declare class CQNodeWorkpathError extends Error {}

interface WorkpathCache {
  groupModuleCfg: {
    [key: string]: any;
  }
}

export default class WorkpathManager {
  basepath: string;
  cache: WorkpathCache;
  /**
   * @deprecated 请使用workpath.resolve
   * @param to path.resolve参数
   */
  getWorkPath(...to: string[]): string;
  /**
   * path.resolve(basepath, ...pathSegments);
   * @param pathSegments path.resolve参数
   */
  resolve(...pathSegments: string[]): string;
  /**
   * 获取指定群，指定模块的设置信息
   * @param {string} group 群号码
   * @param {object} module 模块引用
   * @todo return type
   * @deprecated 将移除，使用cqnode.api.robot.getGroupModuleConfig
   */
  getGroupModuleConfig(group: string, module: Module): any;
  /**
   * 保存指定群，指定模块的设置信息
   * @param {string} group 群号码
   * @param {object} module 模块引用
   * @todo return type
   * @deprecated 将移除，使用cqnode.api.robot.setGroupModuleConfig
   */
  saveGroupModuleConfig(group: string): void;
  /**
   * 以JSON格式读取文件，若文件不存在则创建文件并写入默认内容
   * @param path 路径
   * @param defaultData 文件不存在时写入默认JSON对象，默认为`{}`
   */
  readJson<T = any>(path: string, defaultData?: T): Promise<T>;
  /**
   * 以JSON格式写入文件
   * @param path 路径
   * @param data 写入的JSON对象
   */
  writeJson(path: string, data: any): Promise<void>;
  /**
   * 读取JSON文件并获取同步对象，可以同步读写对象，做出的修改会自动保存到文件。不会监听文件的改动
   *
   * 对同一个path调用多次会返回相同实例，defaultData取第一次调用的传值
   * @param path 读取的json文件路径，不存在则会创建
   * @param defaultData 文件不存在时写入默认JSON对象，默认为`{}`
   */
  getJsonStorage<T = any>(path: string, defaultData?: T): Promise<JsonStorage<T>>;
}
