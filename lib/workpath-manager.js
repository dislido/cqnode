const fs = require('fs');
const path = require('path');

class CQNodeWorkpathError extends Error {}

function createWorkPath(workpath) {
  fs.mkdirSync(workpath);
  fs.mkdirSync(path.resolve(workpath, 'module'));
  fs.mkdirSync(path.resolve(workpath, 'log'));
  fs.mkdirSync(path.resolve(workpath, 'group'));
}

module.exports = class WorkpathManager {
  constructor(workpath) {
    this.workpath = path.resolve(workpath);
    this.cache = Object.assign(Object.create(null), {
      groupModuleCfg: {

      },
    });
    if (fs.existsSync(workpath)) {
      if (!fs.statSync(workpath).isDirectory) {
        throw new CQNodeWorkpathError(`${path.resolve(workpath)} is not a directory`);
      }
      return;
    }
    createWorkPath(workpath);
  }
  getWorkPath(...to) {
    return path.resolve(this.workpath, ...to);
  }
  /**
   * 获取指定群，指定模块的设置信息
   * @param {string} group 群号码
   * @param {object} module 模块引用
   */
  async getGroupModuleConfig(group, module) {
    if (!this.cache.groupModuleCfg[group]) {
      if (!fs.existsSync(path.resolve(this.workpath, `group/${group}`))) {
        fs.mkdirSync(path.resolve(this.workpath, `group/${group}`));
        fs.writeFileSync(path.resolve(this.workpath, `group/${group}/modulecfg.json`), '{}');
      }
      const cfg = JSON.parse(fs.readFileSync(path.resolve(this.workpath, `group/${group}/modulecfg.json`)));
      this.cache.groupModuleCfg[group] = cfg;
    }
    const groupFieldCfg = this.cache.groupModuleCfg[group];
    if (!groupFieldCfg[module.inf.packageName]) groupFieldCfg[module.inf.packageName] = {};
    return groupFieldCfg[module.inf.packageName];
  }
  async saveGroupModuleConfig(group) {
    fs.writeFileSync(
      path.resolve(this.workpath, `group/${group}/modulecfg.json`),
      JSON.parse(this.cache.groupModuleCfg[group]),
    );
  }
};

/*
.cqnode {
  group {
    [groupid] {
      modulecfg.json
    }
  }
  module {
    [packageName.replace(/\//g, '.')] {

    }
  }
  log {

  }
}
 */
