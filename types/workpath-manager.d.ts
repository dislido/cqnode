import * as fs from 'fs';
import * as path from 'path';
import { Module } from './module';

declare class CQNodeWorkpathError extends Error {}

interface WorkpathCache {
  groupModuleCfg: {
    [key: string]: any;
  }
}

export default class WorkpathManager {
  workpath: string;
  cache: WorkpathCache;
  getWorkPath(...to: string[]): string;
  /**
   * 获取指定群，指定模块的设置信息
   * @param {string} group 群号码
   * @param {object} module 模块引用
   * @todo return type
   */
  getGroupModuleConfig(group: string, module: Module): any;
  saveGroupModuleConfig(group: string): void;
}

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
