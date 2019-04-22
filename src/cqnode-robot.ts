import * as EventEmitter from 'events';
import PluginManager from './plugin-manager';
import WorkpathManager from './workpath-manager';
import { checkConfig } from './util';
import { CQNodeModule } from './symbols';
import CQHttpConnector from './connector-cqhttp';

const actTypes = {
  GROUP: 101,
  PM: 106,
};

interface CQNodeConfig {
  qqid: string;
  admin: string | string[];
  listenGroups: string[];
  modules: any[];
  plugins: any[];
  workpath: string;
  prompt: {
    group: string;
    svc: string;
    admin: string;
  }
}

export default class CQNodeRobot extends EventEmitter {
  config: CQNodeConfig;
  workpathManager: WorkpathManager;
  pluginManager: PluginManager;
  connect: CQHttpConnector;
  utils: any;
  modules: any[];

  constructor(config: CQNodeConfig) {
    super();
    this.config = checkConfig(config);
    this.workpathManager = new WorkpathManager(this.config.workpath);
    this.utils = {
      sendPrivateMsg: this.connect.api.sendPrivateMsg,
      send: (msg: string, act: number, to: string) => {
        const event = { msg, act, to };
        if (!this.pluginManager.emit('beforeSendMessage', event)) return true;
        this.connect.api.sendMsg(event.act, event.to, event.msg);
        return true;
      },
      radio: (msg: string, groups = this.config.listenGroups) => {
        const event = { msg, groups };
        if (!this.pluginManager.emit('beforeRadioMessage', event)) return true;
        event.groups.forEach(groupId => this.utils.send(event.msg, actTypes.GROUP, groupId));
        return true;
      },
    };
    this.connect = new CQHttpConnector(this, { LISTEN_PORT: 6363, API_PORT: 5700 });
    
    this.pluginManager = new PluginManager(this);
    this.config.plugins.forEach(plg => this.pluginManager.registerPlugin(plg));

    this.modules = this.config.modules;
    this.modules.forEach((modRef, index) => this.loadModule(index));

    this.on('GroupMessage', async (data) => {
      if (!this.pluginManager.emit('messageReceived', { data })) return;
      if (!this.pluginManager.emit('groupMessageReceived', { data })) return;
      // todo: log
      // namecheck
      Object.assign(data, {
        username: data.nick || data.username,
        atme: false,
        msg: data.msg.trim(),
      });
      // prompt check
      const prompt = this.config.prompt.group;
      if (data.msg.startsWith(prompt)) {
        Object.assign(data, {
          msg: data.msg.substring(prompt.length).trim(),
          atme: true,
        });
      }
      // 回复
      const sendBack = (msg: string, atBack = false) => {
        if (atBack) msg = `[CQ:at,qq=${data.fromQQ}] ${msg}`;
        this.utils.send(msg, actTypes.GROUP, data.fromGroup);
      };
      // 以私聊方式回复
      const sendPrivate = (msg: string) => {
        this.utils.send(msg, actTypes.PM, data.fromQQ);
      };
      // modulerouters
      for (let i = 0; i < this.modules.length; ++i) {
        const currentModule = this.modules[i];
        try {
          const isEnd = await currentModule.onGroupMessage(data, { // eslint-disable-line no-await-in-loop
            send: sendBack,
            sendPrivate,
          });
          if (isEnd) return;
        } catch (err) {
          console.error('module error:', err);
        }
      }
    });
    this.on('PrivateMessage', async (data) => {
      if (!this.pluginManager.emit('messageReceived', { data })) return;
      if (!this.pluginManager.emit('privateMessageReceived', { data })) return;
      Object.assign(data, {
        username: data.nick,
        msg: data.msg.trim(),
        atme: true,
      });
      // modulerouters
      for (let i = 0; i < this.modules.length; ++i) {
        const currentModule = this.modules[i];
        const sendBack = (msg: string) => {
          this.utils.send(msg, actTypes.PM, data.fromQQ);
        };
        try {
          const isEnd = await currentModule.onPrivateMessage(data, { // eslint-disable-line no-await-in-loop
            send: sendBack,
          });
          if (isEnd) return;
        } catch (err) {
          console.error('module error:', err);
        }
      }
    });
  }
  loadModule(modIndex: number) {
    try {
      const m = this.modules[modIndex];
      m[CQNodeModule.onRun](this);
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
      m[CQNodeModule.onStop]();
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }
}
