const fs = require('fs');
const path = require('path');
const CQNodeModule = require('../../robot-module');
const symbols = require('../../symbols');

const { bindingCQNode } = symbols;

// todo: 权限检查
module.exports = class BuiltinAdminModule extends CQNodeModule {
  constructor(prompt) {
    super();
    this.config = {
      prompt,
    };
    this.inf = {
      name: 'BuiltinAdmincModule',
      help: '',
      description: '',
      packageName: 'builtin.AdminModule',
      hidden: true,
    };

    this.commands = {
      eval: {
        apply: (js) => {
          // this = BuiltinAdminModule
          eval(js); // eslint-disable-line no-eval
        },
        auth: 100,
      },
      listcmd: {
        apply: (_, { msgData, resp }) => {
          const userAuth = this.getUserAuth(msgData.fromQQ);
          resp.send(`~$listcmd:\n你的权限是${userAuth},可以使用的指令:\n${
            Object.keys(this.commands)
              .filter(cmdName => this.commands[cmdName].auth <= userAuth)
              .join('\n')
          }`);
        },
        auth: 0,
      },
    };

    this.authData = {};
  }

  onRun() {
    this.loadUserAuth();
  }

  onGroupMessage(msgData, resp) {
    if (!msgData.atme) return false;
    return this.requestAdmin(msgData, resp);
  }

  onPrivateMessage(msgData, resp) {
    return this.requestAdmin(msgData, resp);
  }

  /**
   * @param {object} msgData
   * @param {string} msgData.msg
   */
  requestAdmin(msgData, resp) {
    if (!msgData.msg.startsWith(this.config.prompt)) return false;
    const cmd = msgData.msg.substring(this.config.prompt.length).trim();
    this.dispatchCmd(cmd, msgData, resp);
    return true;
  }

  dispatchCmd(cmd, msgData, resp) {
    const cmdName = cmd.split(' ', 1)[0];
    const cmdStr = cmd.substring(cmdName.length).trim();
    const userAuth = this.getUserAuth(msgData.fromQQ, msgData.act === 2 && msgData.fromGroup);
    if (!this.commands[cmdName]) {
      resp.send(`无此命令, 使用${this.config.prompt}listcmd命令查看所有可用命令`);
      return;
    }
    if (this.commands[cmdName].auth > userAuth) {
      resp.send(`权限不足(${userAuth} - ${this.commands[cmdName].auth}), 使用${this.config.prompt}listcmd命令查看所有可用命令`);
      return;
    }
    this.commands[cmdName].apply(cmdStr, { msgData, resp, bindingCQNode: this[bindingCQNode] });
  }

  getUserAuth(qqid, group) {
    if (this.authData.admin.includes(qqid)) return 100;
    if (!group) return 0;
    if (!this.authData[group]) {
      this.authData[group] = {};
      this.saveUserAuth();
      return 0;
    }
    return this.authData[group][qqid] || 0;
  }

  setUserAuth(qqid, group, auth) {
    if (!this.authData[group]) this.authData[group] = {};
    this.authData[group][qqid] = auth;
  }

  saveUserAuth() {
    this.filepath = this.getFilepath();
    const authDataPath = path.resolve(this.filepath, 'auth.json');
    fs.writeFileSync(authDataPath, JSON.stringify(this.authData, null, 2));
  }

  loadUserAuth() {
    this.filepath = this.getFilepath();
    const authDataPath = path.resolve(this.filepath, 'auth.json');
    const admin = this[bindingCQNode].config.admin;
    if (fs.existsSync(authDataPath)) {
      this.authData = JSON.parse(fs.readFileSync(authDataPath).toString());
      this.authData.admin = admin;
    } else {
      this.authData = {
        admin,
      };
      this.saveUserAuth();
    }
  }
};
/*
command(cmdStr, { msgData, resp, CQNode })

auth: {
  admin: 100,
  groupAdmin: 50,
  normal: 0,
}
 */
