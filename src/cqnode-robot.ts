import event from 'events';
import path from 'path';
import PluginManager from './plugin-manager';
import WorkpathManager from './workpath-manager';
import { nullCQNode } from './util';
import { checkConfig } from './util/config';
import CQHttpConnector from './connector-cqhttp';
import CQNodeModule from './robot-module';
import registerEvent from './register-event';
import CQAPI from './connector-cqhttp/api';
import { CQEvent } from '../types/cq-http';
import { ConfigObject, CQNodeInf, LoadModuleObject, GroupConfig, CQNodeOptions, CQNodeConfig } from '@/types/robot';
import { proxyModuleCQNode } from './util/proxy-module-cqnode';
import { loadGroupConfig } from './util/load-group-config';
import JsonStorage from './workpath-manager/json-storage';
import internalPlugins from './internal-plugins';

export default class Robot extends event.EventEmitter {
  static CQNode: any;
  config: JsonStorage<CQNodeConfig>;

  groupConfig: {
    [group: number]: JsonStorage<GroupConfig>,
    get(group: number): GroupConfig | null,
    set(group: number, config: GroupConfig): boolean,
  } = {
    get: (group: number) => {
      if (this.groupConfig[group]) return this.groupConfig[group].get();
      return null;
    },
    set: (group: number, config: GroupConfig) => {
      if (!this.groupConfig[group]) return false;
      this.groupConfig[group].set(config)
      return true;
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

    this.workpath = new WorkpathManager(workpath);
    this.workpath = this.workpath;
    await this.workpath.init();

    this.config = await this.workpath.getJsonStorage('config.json', defaultConfig as CQNodeConfig);
    this.config.set(checkConfig(this.config.get()))
    const config = this.config.get();

    this.pluginManager = new PluginManager(this);
    this.connect = await new CQHttpConnector(this, config.connector).init();
    this.api = this.connect.api;
    
    await this.initInf();
    await loadGroupConfig.call(this, this.inf.groupList);

    config.modules.forEach(mod => this.loadModule(mod));

    internalPlugins.forEach(plg => this.pluginManager.registerPlugin(plg));
    config.plugins.forEach(plg => this.pluginManager.registerPlugin(plg));

    
    this.setMaxListeners(13);
    registerEvent(this);

    const ready = await this.pluginManager.emit('onReady', {});
    if (!ready) throw new Error('CQNode killed by plugin.onReady');

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

  /** 加载模块到modules */
  loadModule(mod: LoadModuleObject) {
    const { entry, constructorParams = [] } = mod;
    if (this.modules[entry]) return true;
    try {
      const ModuleClass = require(entry.startsWith('.') ? path.resolve(process.cwd(), entry) : entry);
      const module = new ModuleClass(...constructorParams);
      this.modules[entry] = {
        module,
      };
      module.cqnode = proxyModuleCQNode.call(this, module);
      module.isRunning = true;
      module.onRun();
      return true;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  /**
   * 卸载模块
   * @param key 模块entry
   * @deprecated 不会正常工作，只是从modules中删除模块，会导致找不到模块报错
   */
  unLoadModule(key: string) {
    try {
      const m = this.modules[key]?.module;
      if (!m) return false;
      m.onStop();
      m.cqnode = nullCQNode;
      m.isRunning = false;
      Reflect.deleteProperty(this.modules, key);
      return true;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  enableModule(modIndex: string, group?: number) {
    const module = this.modules[modIndex];
    if (!module) return false;
    if (group) {
      const groupConfig = this.groupConfig.get(group);
      if (!groupConfig) return false;
      if (!groupConfig.modules) groupConfig.modules = {};
      if (!groupConfig.modules[modIndex]) groupConfig.modules[modIndex] = { enable: true };
      else groupConfig.modules[modIndex].enable = true;
      return this.groupConfig.set(group, groupConfig);
    }

    const config = this.config.get();
    config.modules.find(it => it.entry === modIndex)!.enable = true;
    this.config.set(config);

    return true;
  }

  disableModule(key: string, group?: number) {
    const module = this.modules[key];
    if (!module) return false;
    if (group) {
      const groupConfig = this.groupConfig.get(group);
      if (!groupConfig) return false;
      const { modules = {} } = groupConfig;
      if (!modules[key]) modules[key] = { enable: false };
      else modules[key].enable = false;
      return this.groupConfig.set(group, groupConfig);
    }

    const config = this.config.get();
    config.modules.find(it => it.entry === key)!.enable = false;
    this.config.set(config);
    return true;
  }
}
