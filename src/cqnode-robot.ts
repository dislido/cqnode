import * as EventEmitter from 'events';
import PluginManager from './plugin-manager';
import WorkpathManager from './workpath-manager';
import { checkConfig } from './util';
import CQHttpConnector from './connector-cqhttp';
import CQNodeModule from './robot-module';
import { CQNodeConfig } from './cqnode';

export default class CQNodeRobot extends EventEmitter {
  config: CQNodeConfig;
  workpathManager: WorkpathManager;
  pluginManager: PluginManager;
  connect: CQHttpConnector;
  api: CQAPI;
  modules: CQNodeModule[];

  constructor(config: CQNodeConfig) {
    super();
    this.config = checkConfig(config);
    this.workpathManager = new WorkpathManager(this.config.workpath);
    /** @todo PORT config */
    this.connect = new CQHttpConnector(this, { LISTEN_PORT: 8080, API_PORT: 5700 });
    // this.pluginManager = new PluginManager(this);
    // this.config.plugins.forEach(plg => this.pluginManager.registerPlugin(plg));

    this.modules = this.config.modules;
    this.modules.forEach((modRef, index) => this.loadModule(index));
    this.api = this.connect.api;
  }
  loadModule(modIndex: number) {
    try {
      const m = this.modules[modIndex];
      m.bindingCQNode = this;
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
      m.bindingCQNode = undefined;
      m.isRunning = false;
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }
}
