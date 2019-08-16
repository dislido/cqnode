import { CQNodeConfig, ConfigObject } from "../types/robot";
import CQNode from ".";
import CQNodeModule from "./robot-module";
import CQNodePlugin from "./robot-plugin";

function isArray(o: any): o is Array<any> {
  return o instanceof Array;
}
/**
 * 检查配置项
 * @param {object} config 配置对象
 */
export function checkConfig(config: ConfigObject) {
  const cfg = {
    admin: [] as number[],
    modules: [] as CQNodeModule[],
    plugins: [] as CQNodePlugin[],
    atmeTrigger: [true] as Array<string | true>,
    workpath: '.cqnode',
    connector: {
      LISTEN_PORT: 8080,
      API_PORT: 5700,
      TIMEOUT: 10000,
    },
    ...config,
  };
  if (!isArray(cfg.admin)) cfg.admin = [cfg.admin];
  if (cfg.admin.some((it: any) => typeof it !== 'number')) {
    throw new Error(`config.admin 的类型必须是 number 或 number[]`);
  }


  if (false === cfg.modules instanceof Array) throw new Error('config.modules 的类型必须是 CQNode.Module[]');
  if (cfg.modules.some((it: any) => false === it instanceof CQNode.Module)) throw new Error('config.modules 的类型必须是 CQNode.Module[]');

  if (!isArray(cfg.atmeTrigger)) cfg.atmeTrigger = [cfg.atmeTrigger];
  cfg.atmeTrigger = cfg.atmeTrigger.map(it => it === true ? it : `${it}`);

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
  return Object.entries(t).reduce((prev: { [key: string]: any }, [key, value]: [string, any]) => {
    if (typeof value === "object") value = toCamelCase(value);
    prev[key.replace(/_([a-z])/g, it => it[1].toUpperCase())] = value;
    return prev;
  }, {});
}

export function decodeHtml(str: string) {
  const s = str.replace(/&#[\d]{2,4};/g, hex => String.fromCharCode(parseInt(hex.slice(2, -1), 10)));
  return s.replace(/&amp;/g, '&');
}
