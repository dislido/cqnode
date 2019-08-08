import * as EventEmitter from 'events';
import PluginManager from './plugin-manager';
import WorkpathManager from './workpath-manager';
import { checkConfig } from './util';
import CQHttpConnector from './connector-cqhttp';
import CQNodeModule from './robot-module';
import { CQNodeConfig, CQNodeInf, ConfigObject } from './cqnode';
import registerEvent from './register-event';


export default class Robot extends EventEmitter {
  config: CQNodeConfig;
  workpathManager: WorkpathManager;
  pluginManager: PluginManager;
  connect: CQHttpConnector;
  modules: CQNodeModule[];
  inf = { inited: false } as CQNodeInf;
  api: CQAPI;
  constructor(config: ConfigObject) {
    super();
    this.config = checkConfig(config);
    this.workpathManager = new WorkpathManager(this.config.workpath);
    this.connect = new CQHttpConnector(this, this.config.connector);
    this.api = this.connect.api;

    this.init();

    this.setMaxListeners(13);
    registerEvent(this);
  }

  async init() {
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
    // this.pluginManager = new PluginManager(this);
    // this.config.plugins.forEach(plg => this.pluginManager.registerPlugin(plg));

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
      m.cqnode = this;
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
      m.cqnode = undefined;
      m.isRunning = false;
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }
}
