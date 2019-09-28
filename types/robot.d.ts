import { Module } from './module';
import { CQAPI, CQHTTP } from './cq-http';
import { EventEmitter } from 'events';
import WorkpathManager from './workpath-manager';
import { util } from './util';
import { Plugin } from './plugin';

interface CQNodeConfig {
  /** 管理员 */
  admin: number[];
  /** 加载的模块 */
  modules: Module[];
  /** 加载的插件 */
  plugins: any[];
  /** 数据文件夹 */
  workpath: string;
  /**
   * atme判断字符串  
   * 以该字符串开头的信息会被任务at了本机器人  
   * 默认使用QQ的at  
   * 空字符串表示将任何消息当作at了本机器人
   */
  atmeTrigger: Array<string | true>;
  connector: {
    LISTEN_PORT: number;
    API_PORT: number;
    TIMEOUT: number;
    ACCESS_TOKEN?: string;
  }
}

export interface ConfigObject {
  /** 
   * 管理员
   */
  admin?: number | number[];
  /** 加载的模块 */
  modules?: Module[];
  /** 加载的插件 */
  plugins?: any[];
  /** 数据文件夹 */
  workpath?: string;
  /** HTTP API 连接配置 */
  connector?: {
    /** 事件监听接口 */
    LISTEN_PORT?: number;
    /** HTTP API接口 */
    API_PORT?: number;
    /** 事件处理超时时长（毫秒） */
    TIMEOUT?: number;
    /** access_token */
    ACCESS_TOKEN?: string;
  };
  /**
   * atme判断字符串  
   * 以该字符串开头的信息会被任务at了本机器人  
   * 默认使用QQ的at  
   * 空字符串表示将任何消息当作at了本机器人
   */
  atmeTrigger?: string | true | Array<string | true>;
}
/** CQNode运行时信息 */
interface CQNodeInf {
  /** inf是否已获取 */
  inited: boolean;
  /** api.getLoginInfo, 当前登录号信息 */
  loginInfo: {
    nickname: string;
    userId: number;
  };
  /** 插件运行状态 */
  status: {
    /** 当前 QQ 在线，null 表示无法查询到在线状态 */
    online: boolean;
    /** HTTP API 插件状态符合预期，意味着插件已初始化，内部插件都在正常运行，且 QQ 在线 */
    good: boolean;
  };
  /** 酷Q 及 HTTP API 插件的版本信息 */
  versionInfo: {
    /** 酷Q 根目录路径 */
    coolqDirectory: string;
    /** 酷Q 版本，air 或 pro */
    coolqEdition: string;
    /** HTTP API 插件版本，例如 2.1.3 */
    pluginVersion: string;
    /** HTTP API 插件 build 号 */
    pluginBuildNumber: number;
    /** HTTP API 插件编译配置，debug 或 release */
    pluginBuildConfiguration: string;
  };
  /** CQNode版本 */
  CQNodeVersion: string;
  /** 群列表 */
  groupList: CQHTTP.GetGroupListResponseData[];
}

export class Robot extends EventEmitter {
  static CQNode: {
    createRobot(config: ConfigObject): Robot;
    Module: typeof Module;
    Plugin: typeof Plugin;
    util: typeof util;
  };
  /** CQNode配置 */
  config: CQNodeConfig;
  /** 已加载的模块 */
  modules: Module[];
  /** CQNode运行时信息 */
  inf: CQNodeInf;
  /** CQ HTTP API */
  api: CQAPI;
  /** @WIP workpath */
  workpathManager: WorkpathManager;
}
export interface Robot {
  constructor: typeof Robot;
}