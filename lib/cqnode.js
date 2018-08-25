const EventEmitter = require('events');
const PluginManager = require('./plugin-manager');
const WorkpathManager = require('./workpath-manager');
const ModuleSvcManager = require('./module-svc-manager');
const builtinModules = require('./builtin-modules');
const cqutil = require('./util');
const lemocConnector = require('./connector-cq-lemoc');
const winrobot = require('./utils/winrobot');
const symbols = require('./symbols');

const actTypes = {
  GROUP: 101,
  PM: 106,
};

class CQNode extends EventEmitter {
  constructor(config) {
    super();
    this.config = cqutil.checkConfig(config);
    this.workpathManager = new WorkpathManager(this.config.workpath);
    this.moduleSvcManager = new ModuleSvcManager();
    this.connect = lemocConnector.connect(this, this.config.lemocURL);
    this.utils = {
      winrobot,
      send: (msg, act, to) => {
        console.log('send', msg, act, to);
        const event = { msg, act, to };
        if (!this.pluginManager.emit('beforeSendMessage', event)) return;
        this.connect.sendMsg(event.act, event.to, event.msg);
      },
      radio: (msg, groups = this.config.listenGroups) => {
        const event = { msg, groups };
        if (!this.pluginManager.emit('beforeRadioMessage', event)) return;
        event.groups.forEach(groupId => this.utils.send(event.msg, actTypes.GROUP, groupId));
      },
    };

    this.pluginManager = new PluginManager(this);
    this.config.plugins.forEach(plg => this.pluginManager.registerPlugin(plg));

    this.modules = [...builtinModules.map(M => new M()), ...this.config.modules].map((mod) => {
      mod[symbols.bindingCQNode] = this;
      return mod;
    });
    this.modules.forEach((modRef, index) => this.loadModule(index));

    /**
     * { username: 'DisLido',
  nick: '用户',
  sex: '0',
  age: '0',
  error: '0',
  act: '2',
  fromGroup: '488733372',
  fromGroupName: '',
  fromQQ: '909796264',
  subType: '1',
  sendTime: '10837',
  fromAnonymous: '',
  msg: '[CQ:at,qq=3368358116] 1',
  font: '8578984',

  atme
  username
}
     */
    this.on('groupMessage', async (data) => {
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
      const prompt = this.config.prompt;
      if (data.msg.startsWith(prompt)) {
        Object.assign(data, {
          msg: data.msg.substring(prompt.length).trim(),
          atme: true,
        });
      }
      // 回复
      const sendBack = (msg, atBack = false) => {
        if (atBack) msg = `[CQ:at,qq=${data.fromQQ}] ${msg}`;
        this.utils.send(msg, actTypes.GROUP, data.fromGroup);
      };
      // 以私聊方式回复
      const sendPrivate = (msg) => {
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
    /**
     * { nick: 'DisLido',
  sex: '0',
  age: '0',
  error: '0',
  act: '21',
  fromQQ: '909796264',
  subType: '11',
  sendTime: '10845',
  font: '54320960',
  msg: '123' }
     */
    this.on('primaryMessage', async (data) => {
      if (!this.pluginManager.emit('messageReceived', { data })) return;
      if (!this.pluginManager.emit('primaryMessageReceived', { data })) return;
      Object.assign(data, {
        username: data.nick,
        msg: data.msg.trim(),
      });
      // modulerouters
      for (let i = 0; i < this.modules.length; ++i) {
        const currentModule = this.modules[i];
        const sendBack = (msg) => {
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
  loadModule(modIndex) {
    try {
      const m = this.modules[modIndex];
      m[symbols.CQNodeModule.onRun](this);
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }
  unLoadModule(modIndex) {
    try {
      const m = this.modules[modIndex];
      if (!m) return false;
      m[symbols.CQNodeModule.onStop]();
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }
}

module.exports = CQNode;
