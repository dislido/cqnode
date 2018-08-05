// const CQNodePlugin = require('./cqnode-plugin');
const CQNodeModule = require('./module-register');
const PluginManager = require('./plugin-manager');

const conn = require('./connector-cq-lemoc');
const winrobot = require('./utils/winrobot');

const robot = conn.getRobot();

const actTypes = {
  GROUP: 101,
  PM: 106,
};

class CQNode {
  constructor(config) {
    this.config = {
      listenGroups: [],
      modules: [],
      plugins: [],
      ...config,
    };
    if (!this.config.qqid) throw new TypeError('config.qqid is required');

    this.utils = {
      winrobot,
      send: (msg, act, to) => {
        const event = { msg, act, to };
        if (!this.pluginManager.emit('beforeSendMessage', event)) return;
        conn.sendMsg(event.act, event.to, event.msg);
      },
      radio: (msg, groups = this.config.listenGroups) => {
        const event = { msg, groups };
        if (!this.pluginManager.emit('beforeRadioMessage', event)) return;
        event.groups.forEach(groupId => this.utils.send(event.msg, actTypes.GROUP, groupId));
      },
    };

    this.pluginManager = new PluginManager(this);
    this.config.plugins.forEach(plg => this.pluginManager.registerPlugin(plg));

    this.modules = this.config.modules.map(mod => CQNodeModule(mod));
    this.modules.forEach((modRef, index) => this.loadModule(index));

    // subType，sendTime，fromGroup, fromQQ ，fromAnonymous,  msg, font, username,
    // nick, sex, age, fromGroupName
    robot.onGroupMessage = async (data) => {
      if (!this.pluginManager.emit('messageReceived', { data })) return;
      if (!this.pluginManager.emit('groupMessageReceived', { data })) return;
      // todo: log
      // namecheck
      Object.assign(data, {
        username: data.nick || data.username,
        atme: false,
        msg: data.msg.trim(),
      });
      // atme check
      const at = `[CQ:at,qq=${this.config.qqid}]`;
      if (data.msg.startsWith(at)) {
        Object.assign(data, {
          msg: data.msg.substring(at.length).trim(),
          atme: true,
        });
      }
      // modulerouters
      for (let i = 0; i < this.modules.length; ++i) {
        const currentModule = this.modules[i];
        const sendBack = (msg, atBack = false) => {
          if (atBack) msg = `[CQ:at,qq=${data.fromQQ}] ${msg}`;
          this.utils.send(msg, actTypes.GROUP, data.fromGroup);
        };
        try {
          // eslint-disable-next-line no-continue
          if (!this.pluginManager.emit('moduleWillReceiveMessage', { data, module: currentModule })) continue;
          const isEnd = await currentModule.onGroupMessage(data, { // eslint-disable-line no-await-in-loop
            send: sendBack,
          });
          if (isEnd) return;
        } catch (err) {
          console.error('module error:', err);
        }
      }
    };
  }
  loadModule(modIndex) {
    try {
      const m = this.modules[modIndex];
      m[CQNodeModule.symbols.onRun](this);
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
      m[CQNodeModule.symbols.onStop]();
      return true;
    } catch (e) {
      console.error(e);
    }
    return false;
  }
}

// CQNode.CQNodePlugin = CQNodePlugin;
CQNode.CQNodeModule = CQNodeModule;

module.exports = CQNode;
