import * as event from 'events';
import PluginManager from './plugin-manager';
import WorkpathManager from './workpath-manager';
import { checkConfig, nullCQNode } from './util';
import OicqConnector, { OicqConfig } from './connector-oicq';
import CQNodeModule from './robot-module';
import registerEvent from './register-event';
import CQAPI from './connector-oicq/api';
import { CQEvent, CQHTTP } from '../types/connector';

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
  /** 连接配置 */
  connector?: OicqConfig;
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
   * 以该字符串开头的信息会被认为at了本机器人，并在消息中添加atme=true标识  
   * 默认使用QQ的at  
   * 空字符串表示将任何消息当作at了本机器人
   */
  atmeTrigger: Array<string | true>;
  connector: OicqConfig;
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
  CQNodeVersion: string;
  /** 群列表 */
  groupList: CQHTTP.GetGroupListResponseData[];
}

export default class Robot extends event.EventEmitter {
  static CQNode: any;
  config: CQNodeConfig;
  workpathManager: WorkpathManager;
  pluginManager: PluginManager;
  connect: OicqConnector;
  modules: CQNodeModule[];
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  inf = { inited: false, CQNodeVersion: require('../package.json').version } as CQNodeInf;
  api: any; // typeof CQAPI;
  constructor(config: ConfigObject) {
    super();
    this.config = checkConfig(config);
    this.workpathManager = new WorkpathManager(this.config.workpath);
    this.pluginManager = new PluginManager(this);
    this.connect = new OicqConnector(this, this.config.connector);
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

    await this.workpathManager.init();

    this.config.plugins.forEach(plg => this.pluginManager.registerPlugin(plg));

    this.modules = this.config.modules;
    this.modules.forEach((modRef, index) => this.loadModule(index));
    this.pluginManager.emit('onReady', {});
    console.log('cqnode: 初始化完成');
  }

  async initInf() {
    try {
      await Promise.all([
        (async () => this.api.getLoginInfo().then((inf: any) => {
          this.inf.loginInfo = {
            nickname: inf.data.nickname,
            userId: inf.data.user_id,
          };
        }))(),
        (() => this.api.getGroupList().then((inf: any) => {
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
        return new Proxy(Reflect.get(api, p), {
          apply: (target, thisArg, argArray) => {
            const plgret = this.pluginManager.emit('onRequestAPI', {
              get caller() { return mod; },
              apiName: p as keyof typeof CQAPI,
              params: argArray as any,
              function: undefined,
            });
            if (plgret === false) throw new Error(`CQNode: API请求被拦截: ${mod.inf.name} ${p as string}(${argArray.join(', ')})`);
            if (plgret.function) return plgret.function.apply(thisArg, plgret.params);
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
