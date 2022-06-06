import fs from 'fs';
import path from 'path';
import util from 'util';

const exists = util.promisify(fs.exists);

class CQNodeWorkpathError extends Error {}

interface WorkpathCache {
  groupModuleCfg: {
    [key: string]: any;
  };
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
      for (let index = 1; index < paths.length; index++) {
        currPath = path.resolve(currPath + path.sep, paths[index]);
        if (!await exists(currPath)) {
          await fs.promises.mkdir(currPath);
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
   * @param jsonPath 路径
   * @param defaultData 文件不存在时写入默认JSON对象，默认为`{}`
   */
  async readJson(jsonPath: string, defaultData: any = {}) {
    await this.ensurePath(path.resolve(this.workpath, jsonPath), null, defaultData);
    const fileBuf = await fs.promises.readFile(jsonPath);
    const data = fileBuf.toString();
    return JSON.parse(data || JSON.stringify(defaultData));
  }

  /**
   * 以JSON格式写入文件
   * @param jsonPath 路径
   * @param data 写入的JSON对象
   */
  async writeJson(jsonPath: string, data: any) {
    await this.ensurePath(path.resolve(this.workpath, jsonPath));
    return fs.promises.writeFile(jsonPath, JSON.stringify(data));
  }
}

/*
.cqnode {
  group {
    [groupid] {
      config.json
    }
  }
  moduleStorage {
    [packageName.replace(/\//g, '__')] {

    }
  }
  log {

  }
}
 */
