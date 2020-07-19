import fs from 'fs';
import path from 'path';
import util from 'util';
import JsonStorage from './json-storage';

const exists = util.promisify(fs.exists);

class CQNodeWorkpathError extends Error {}

export default class WorkpathManager {
  basepath: string;
  constructor(workpath: string) {
    this.basepath = path.resolve(workpath);
  }

  async init() {
    return Promise.all([
      this.ensurePath(path.resolve(this.basepath, 'module'), null),
      this.ensurePath(path.resolve(this.basepath, 'log'), null),
      this.ensurePath(path.resolve(this.basepath, 'group'), null),
      this.ensurePath(this.basepath, 'config.json', 'null'),
    ]);
  }

  /**
   * @deprecated 使用resolve
   */
  getWorkPath(...to: string[]) {
    return path.resolve(this.basepath, ...to);
  }

  resolve(...pathSegments: string[]) {
    return path.resolve(this.basepath, ...pathSegments);
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
  async readJson<T = any>(path: string, defaultData: any = {}): Promise<T> {
    const fullPath = this.resolve(path);
    await this.ensurePath(fullPath, '', JSON.stringify(defaultData));
    const fileBuf = await fs.promises.readFile(fullPath);
    const data = fileBuf.toString();
    return JSON.parse(data);
  }
  
  /**
   * 以JSON格式写入文件
   * @param path 路径，相对路径以workpath为根路径
   * @param data 写入的JSON对象
   */
  async writeJson(path: string, data: any) {
    const fullPath = this.resolve(path);
    await this.ensurePath(fullPath);
    return fs.promises.writeFile(fullPath, JSON.stringify(data, null, 2));
  }

  /**
   * 读取JSON文件并获取同步对象，可以同步读写对象，做出的修改会自动保存到文件。不会监听文件的改动
   *
   * 对同一个path调用多次会返回相同实例，defaultData取第一次调用的传值
   * @param path 读取的json文件路径，不存在则会创建
   * @param defaultData 文件不存在时写入默认JSON对象，默认为`{}`
   */
  async getJsonStorage<T = any>(path: string, defaultData: T = {} as T) {
    const storage = new JsonStorage(path, defaultData, this);
    await storage.ready();
    return storage;
  }
}
