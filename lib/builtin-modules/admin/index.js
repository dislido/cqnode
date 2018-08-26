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
      eval(js) {
        eval(js); // eslint-disable-line no-eval
      },
      listcmd(_, { resp }) {
        resp.send(`~$listcmd:\n${Object.keys(this.commands).join('\n')}`);
      },
    };
  }

  onRun() {
    this.filepath = this.getFilepath();
    const authDataPath = path.resolve(this.filepath, 'auth.json');
    if (fs.existsSync(authDataPath)) {
      this.authData = JSON.parse(fs.readFileSync(authDataPath).toString());
    } else {
      this.authData = {};
      fs.writeFileSync(authDataPath, '{}');
    }
  }

  onGroupMessage(msgData, resp) {
    if (!msgData.atme) return false;
    return this.requestAdmin(msgData, resp);
  }

  onPrimaryMessage(msgData, resp) {
    return this.requestAdmin(msgData, resp);
  }

  /**
   * @param {object} msgData
   * @param {string} msgData.msg
   */
  requestAdmin(msgData, resp) {
    if (!msgData.msg.startsWith(this.config.prompt)) return false;
    const cmd = msgData.msg.substring(this.config.prompt.length).trim();
    return this.dispatchCmd(cmd, msgData, resp);
  }

  dispatchCmd(cmd, msgData, resp) {
    const cmdName = cmd.split(' ', 1)[0];
    const cmdStr = cmd.substring(cmdName.length).trim();
    if (!this.commands[cmdName]) {
      resp.send('无此命令, 使用listcmd命令查看所有命令');
      return false;
    }
    this.commands[cmdName](cmdStr, { msgData, resp, bindingCQNode: this[bindingCQNode] });
    return true;
  }

  getUserAuth(qqid) {
    if (this[bindingCQNode].config.admin.includes[qqid]) return 100;

    return 0;
  }
};
/*
command(cmdStr, { msgData, resp, CQNode })
 */
