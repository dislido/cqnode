import { CQNodeConfig } from "./cqnode";
import CQNode from ".";

/**
 * 检查配置项
 * @param {object} config 配置对象
 */
export function checkConfig(config: any) {
  const cfg = {
    admin: [],
    modules: [],
    prompt: true,
    workpath: '.cqnode',
    connector: {
      LISTEN_PORT: 8080,
      API_PORT: 5700,
      TIMEOUT: 10000,
    },
    ...config,
  };
  if (typeof cfg.admin !== 'number') {
    if (false === cfg.admin instanceof Array || cfg.admin.some((it: any) => typeof it !== 'number')) {
      throw new Error('config.admin 的类型必须是 number 或 number[]')
    }
    throw new Error('config.admin 的类型必须是 number 或 number[]')
  }

  if (false === cfg.modules instanceof Array) throw new Error('config.modules 的类型必须是 CQNodeModule[]');
  if (cfg.modules.some((it: any) => false === it instanceof CQNode.Module)) throw new Error('config.modules 的类型必须是 CQNode.Module[]');

  if (cfg.prompt !== true) cfg.prompt = `${cfg.prompt}`;

  cfg.workpath = `${cfg.workpath}`;

  if (typeof cfg.connector !== 'object') throw new Error('config.connector 必须是对象');
  
  return cfg as CQNodeConfig;
}

export function toUnderScoreCase(obj: object): object;
export function toUnderScoreCase(str: string): string;
export function toUnderScoreCase(t: any) {
  if (!t) return t;
  if (typeof t === 'string') return t.replace(/[(A-Z)]/g, it => `_${it.toLowerCase()}`);
  return Object.entries(t).reduce((prev: { [key: string]: any }, [key, value]) => {
    prev[key.replace(/[(A-Z)]/g, it => `_${it.toLowerCase()}`)] = value;
    return prev;
  }, {});
}

export function toCamelCase(obj: object): object;
export function toCamelCase(str: string): string;
export function toCamelCase(t: any) {
  if (!t) return t;
  if (typeof t === 'string') return t.replace(/_([a-z])/g, it => it[1].toUpperCase());
  return Object.entries(t).reduce((prev: { [key: string]: any }, [key, value]) => {
    if (typeof value === "object") value = toCamelCase(value);
    prev[key.replace(/_([a-z])/g, it => it[1].toUpperCase())] = value;
    return prev;
  }, {});
}

