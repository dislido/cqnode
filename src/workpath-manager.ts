import fs from 'fs';
import path from 'path';
import util from 'util';
import CQNodeModule from './robot-module';

const exists = util.promisify(fs.exists);

class CQNodeWorkpathError extends Error {}


interface WorkpathCache {
  groupModuleCfg: {
    [key: string]: any;
  }
}

export default class WorkpathManager {
  workpath: string;
  cache: WorkpathCache;
  constructor(workpath: string) {
    this.workpath = path.resolve(workpath);
    this.cache = Object.assign(Object.create(null), {
      groupModuleCfg: {

      },
    });
  }

  async init() {
    await this.ensurePath(path.resolve(this.workpath, 'module'), null);
    await this.ensurePath(path.resolve(this.workpath, 'log'), null);
    await this.ensurePath(path.resolve(this.workpath, 'group'), null);
  }

  getWorkPath(...to: string[]) {
    return path.resolve(this.workpath, ...to);
  }

  /**
   * 递归创建目录和文件
   * @param dir 目录路径
   * @param file 文件名，传null则只创建目录，空字符串或不传则从第一个参数中取文件名
   * @param defaultFileData 默认文件内容，文件不存在时会创建此内容的文件
   * @returns 完整路径
   */
  async ensurePath(dir: string, file: string | null = '', defaultFileData = '') {
    const fullPath = path.resolve(dir);
    const paths = fullPath.split(path.sep);
    if (file === '') {
      file = paths.pop()!;
    }
    let currPath = paths[0];
    if (paths.length > 1) {
      for(let index = 1; index < paths.length; index ++) {
        currPath = path.resolve(currPath + path.sep, paths[index]);
        if (!await exists(currPath)) {
          
          await fs.promises.mkdir(currPath)
        } else if (!(await fs.promises.stat(currPath)).isDirectory()) {
          throw new CQNodeWorkpathError(`${currPath}已存在且不是目录`);
        }
      }
    }
    if (file !== null) {
      currPath = path.resolve(currPath, file);
      if (!await exists(currPath)) {
        await fs.promises.writeFile(currPath, defaultFileData);
      } else if (!(await fs.promises.stat(currPath)).isFile()) {
        throw new CQNodeWorkpathError(`${currPath}已存在且不是文件`);
      }
    }
    return currPath;
  }

  /**
   * 以JSON格式读取文件，若文件不存在则创建文件并写入默认内容
   * @param path 路径
   * @param defaultData 文件不存在时写入默认JSON对象，默认为`{}`
   */
  async readJson(path: string, defaultData: any = {}) {
    await this.ensurePath(path);
    const fileBuf = await fs.promises.readFile(path);
    const data = fileBuf.toString();
    return JSON.parse(data || JSON.stringify(defaultData));
  }
  
  /**
   * 以JSON格式写入文件
   * @param path 路径
   * @param data 写入的JSON对象
   */
  async writeJson(path: string, data: any) {
    await this.ensurePath(path);
    return fs.promises.writeFile(path, JSON.stringify(data));
  }
  /**
   * 获取指定群，指定模块的设置信息
   * @deprecated 不稳定的API，未来可能会改变或删除
   * @param {string} group 群号码
   * @param {object} module 模块引用
   */
  async getGroupModuleConfig(group: string, module: CQNodeModule) {
    if (!this.cache.groupModuleCfg[group]) {
      const cfg = this.readJson(path.resolve(this.workpath, `group/${group}/config.json`))
      this.cache.groupModuleCfg[group] = cfg;
    }
    const groupFieldCfg = this.cache.groupModuleCfg[group];
    if (!module.inf.packageName) throw new Error('无法在匿名模块中使用此功能，添加inf.packageName以启用此功能');
    if (!groupFieldCfg[module.inf.packageName]) groupFieldCfg[module.inf.packageName] = {};
    return groupFieldCfg[module.inf.packageName];
  }

  async saveGroupModuleConfig(group: string) {
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
