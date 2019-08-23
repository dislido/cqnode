import * as event from 'events';
import PluginManager from './plugin-manager';
import WorkpathManager from './workpath-manager';
import { checkConfig } from './util';
import CQHttpConnector from './connector-cqhttp';
import CQNodeModule from './robot-module';
import registerEvent from './register-event';
import CQAPI from './connector-cqhttp/api';
import { CQEvent, CQHTTP } from '../types/cq-http';
import { nullCQNode } from './cqnode-util';

export interface ConfigObject {
  /** 
   * 管理员
   */
  admin?: number | number[];
  /** 加载的模块 */
  modules?: CQNodeModule[];
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

export interface CQNodeConfig {
  /** 管理员 */
  admin: number[];
  /** 加载的模块 */
  modules: CQNodeModule[];
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
  /** 群列表 */
  groupList: CQHTTP.GetGroupListResponseData[];
}

export default class Robot extends event.EventEmitter {
  config: CQNodeConfig;
  workpathManager: WorkpathManager;
  pluginManager: PluginManager;
  connect: CQHttpConnector;
  modules: CQNodeModule[];
  inf = { inited: false } as CQNodeInf;
  api: typeof CQAPI;
  constructor(config: ConfigObject) {
    super();
    this.config = checkConfig(config);
    this.workpathManager = new WorkpathManager(this.config.workpath);
    this.pluginManager = new PluginManager(this);
    this.connect = new CQHttpConnector(this, this.config.connector);
    this.api = this.connect.api;

    this.init();

    this.setMaxListeners(13);
    registerEvent(this);
  }

  private async init() {
    console.log('cqnode: 初始化中......');
    const isInfInited = await this.initInf();
    if (!isInfInited) {
      console.warn('cqnode warn: 未能获取到运行信息，可能因为酷Q或HTTP API插件未启动或配置不正确，CQNode会在接收到HTTP API启动事件后开始初始化');
      this.once('LifecycleMeta', (data: CQEvent.LifecycleMeta) => {
        if (data.subType === 'enable') this.init();
      });
      return;
    } else {
      this.inf.inited = true;
    }

    this.config.plugins.forEach(plg => this.pluginManager.registerPlugin(plg));

    this.modules = this.config.modules;
    this.modules.forEach((modRef, index) => this.loadModule(index));
    console.log('cqnode: 初始化完成');
  }

  async initInf() {
    try {
      await Promise.all([
        (async () => this.api.getLoginInfo().then(inf => {
          this.inf.loginInfo = {
            nickname: inf.data.nickname,
            userId: inf.data.user_id,
          };
        }))(),
        (() => this.api.getStatus().then(inf => {
          this.inf.status = {
            online: inf.data.online,
            good: inf.data.good,
          };
        }))(),
        (() => this.api.getVersionInfo().then(inf => {
          this.inf.versionInfo = {
            coolqDirectory: inf.data.coolq_directory,
            coolqEdition: inf.data.coolq_edition,
            pluginVersion: inf.data.plugin_version,
            pluginBuildNumber: inf.data.plugin_build_number,
            pluginBuildConfiguration: inf.data.plugin_build_configuration,
          };
        }))(),
        (() => this.api.getGroupList().then(inf => {
          this.inf.groupList = inf.data;
        }))()
      ]);
    } catch (e) {
      return false;
    }
    return true;
  }

  /** @todo 检查冲突模块 */
  loadModule(modIndex: number) {
    try {
      const m = this.modules[modIndex];
      m.cqnode = this.proxy(m);
      m.isRunning = true;
      m.onRun();
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  unLoadModule(modIndex: number) {
    try {
      const m = this.modules[modIndex];
      if (!m) return false;
      m.onStop();
      m.cqnode = nullCQNode;
      m.isRunning = false;
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }

  proxy(mod: CQNodeModule) {
    const apiProxy = new Proxy(this.api, {
      get: (api, p) => {
        if (!Reflect.has(api, p)) return undefined;
        return new Proxy<Function>(Reflect.get(api, p), {
          apply: (target, thisArg, argArray) => {
            const plgret = this.pluginManager.emit('onRequestAPI', {
              get caller() { return mod; },
              apiName: p as keyof typeof CQAPI,
              params: argArray,
            });
            if (plgret === false) throw new Error('CQNode Error: API请求被拦截');
            return api[plgret.apiName].apply(thisArg, plgret.params);
          }
        });
      }
    });
    return new Proxy(this, {
      get(cqn, p) {
        if (p === 'api') return apiProxy;
        return Reflect.get(cqn, p);
      },
    });
  }
}
