import event from 'events';
import path from 'path';
import PluginManager from './plugin-manager';
import WorkpathManager from './workpath-manager';
import { nullCQNode } from './util';
import { loadConfig } from './util/config';
import CQHttpConnector from './connector-cqhttp';
import CQNodeModule from './robot-module';
import registerEvent from './register-event';
import CQAPI from './connector-cqhttp/api';
import { CQEvent, CQHTTP } from '../types/cq-http';
import { CQNodeConfig, ConfigObject, CQNodeInf, LoadModuleObject, GroupConfig, CQNodeOptions } from '@/types/robot';

export default class Robot extends event.EventEmitter {
  static CQNode: any;
  config: CQNodeConfig;
  groupConfig: {
    [group: number]: GroupConfig,
    get(group: number): Promise<GroupConfig>,
    save(group: number, config: GroupConfig): Promise<void>,
  } = {
    get: async(group: number) => {
      if (this.groupConfig[group]) return this.groupConfig[group];
      this.groupConfig[group] = await this.workpathManager.readJson(this.workpathManager.getWorkPath(`group/${group}/config.json`));
      return this.groupConfig[group];
    },
    save: async(group: number, config: GroupConfig) => {
      await this.workpathManager.writeJson(this.workpathManager.getWorkPath(`group/${group}/config.json`), config);
      this.groupConfig[group] = config;
    },
  };
  workpath: WorkpathManager;
  workpathManager: WorkpathManager;
  pluginManager: PluginManager;
  connect: CQHttpConnector;
  modules: {
    [key: string]: {
      module: CQNodeModule
    };
  } = {};
  inf = { inited: false, CQNodeVersion: require('../package.json').version } as CQNodeInf;
  api: typeof CQAPI;
  constructor(public options: CQNodeOptions = {}, defaultConfig: ConfigObject = {}) {
    super();
    const { workpath = '.cqnode' } = options;

    this.init(workpath, defaultConfig);
  }

  private async init(workpath: string, defaultConfig: ConfigObject) {
    console.log('cqnode: 初始化中......');

    this.workpathManager = new WorkpathManager(workpath);
    this.workpath = this.workpathManager;
    await this.workpathManager.init();
    this.config = await loadConfig.call(this, defaultConfig);

    this.pluginManager = new PluginManager(this);
    this.connect = await new CQHttpConnector(this, this.config.connector).init();
    this.api = this.connect.api;

    const isInfInited = await this.initInf();

    this.config.modules.forEach(mod => this.loadModule(mod));
    this.config.plugins.forEach(plg => this.pluginManager.registerPlugin(plg));

    this.pluginManager.emit('onReady', {});
    
    this.setMaxListeners(13);
    registerEvent(this);
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
      console.warn('cqnode warn: 未能获取到运行信息，可能因为酷Q或HTTP API插件未启动或配置不正确，CQNode会在接收到HTTP API启动事件后开始初始化');

      return new Promise(res => {
        this.once('LifecycleMeta', (data: CQEvent.LifecycleMeta) => {
          if (data.subType === 'enable') this.initInf().then(res);
        });
      });
    }
    this.inf.inited = true;
  }

  loadModule(mod: LoadModuleObject) {
    const { entry, constructorParams = [] } = mod;
    if (this.modules[entry]) return true;
    try {
      const ModuleClass = require(entry.startsWith('.') ? path.resolve(process.cwd(), entry) : entry);
      const module = new ModuleClass(...constructorParams);
      this.modules[entry] = {
        module,
      };
      module.cqnode = this.proxy(module);
      module.isRunning = true;
      module.onRun();
      return true;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  unLoadModule(modIndex: string) {
    try {
      const m = this.modules[modIndex]?.module;
      if (!m) return false;
      m.onStop();
      m.cqnode = nullCQNode;
      m.isRunning = false;
      Reflect.deleteProperty(this.modules, modIndex);
      return true;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async enableModule(modIndex: string, group?: number) {
    const module = this.modules[modIndex];
    if (!module) return false;
    if (group) {
      const groupConfig = await this.groupConfig.get(group);
      if (!groupConfig.modules) groupConfig.modules = {};
      if (!groupConfig.modules[modIndex]) groupConfig.modules[modIndex] = { enable: true };
      else groupConfig.modules[modIndex].enable = true;
      await this.groupConfig.save(group, groupConfig);
    } else {
      this.config.modules.find(it => it.entry === modIndex)!.enable = true;
      await this.workpathManager.writeJson(this.workpathManager.getWorkPath('config.json'), this.config);
    }
    return true;
  }

  async disableModule(modIndex: string, group?: number) {
    const module = this.modules[modIndex];
    if (!module) return false;
    if (group) {
      const groupConfig = await this.groupConfig.get(group);
      const { modules = {} } = groupConfig;
      if (!modules[modIndex]) modules[modIndex] = { enable: false };
      else modules[modIndex].enable = false;
      await this.groupConfig.save(group, groupConfig);
    } else {
      this.config.modules.find(it => it.entry === modIndex)!.enable = false;
      await this.workpathManager.writeJson(this.workpathManager.getWorkPath('config.json'), this.config);
    }
    return true;
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
