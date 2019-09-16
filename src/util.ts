import Robot, { CQNodeConfig, ConfigObject } from "./cqnode-robot";
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
  if (!t || t instanceof Array) return t;
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

export const nullCQNode = new Proxy({}, {
  get() {
    throw new Error('CQNode Error: 模块/插件未运行，不能使用CQNode');
  }
}) as Robot;

type CQCodeData = {
  type: string;
  data: {
    [key: string]: string;
  }
};

class CQCodeString extends String {
  parse(this: string) {
    return CQCode.parseCQCodeString(this);
  }
}

export function CQCode(type: string, data: { [key:string]: string | number | boolean } = {}) {
  const dataEntries = Object.entries(data);
  return new CQCodeString(`[CQ:${type}${dataEntries.length > 0 ? ',':''}${dataEntries.map(it => it.join('=')).join(',')}]`);
}
CQCode.CQCodeString = CQCodeString;
CQCode.parseCQCodeString = (code: string) => {
  const ret = /\[CQ:([^,]+)(.*)\]/.exec(code);
  if (!ret) return;
  const result: CQCodeData = {
    type: ret[1],
    data: {},
  };
  if (ret[2]) {
    const data = ret[2].split(',');
    data.shift();
    data.forEach(it => {
      const split = it.indexOf('=');
      const [k, v] = [it.substr(0, split), it.substr(split + 1)];
      result.data[k] = v;
    })
  }
  return result;
};
/*
https://d.cqp.me/Pro/CQ%E7%A0%81
[
  "[CQ:face,id={1}]",
  "[CQ:emoji,id={1}]",
  "[CQ:bface,id={1}]",
  "[CQ:sface,id={1}]",
  "[CQ:image,file={1}]",
  "[CQ:record,file={1},magic={2}]",
  "[CQ:at,qq={1}]",
  "[CQ:rps,type={1}]",
  "[CQ:dice,type={1}]",
  "[CQ:shake]",
  "[CQ:anonymous,ignore={1}]",
  "[CQ:music,type={1},id={2}]",
  "[CQ:music,type=custom,url={1},audio={2},title={3},content={4},image={5}]",
  "[CQ:share,url={1},title={2},content={3},image={4}]"
]
*/
CQCode.face = (id: number) => new CQCodeString(`[CQ:face,id=${id}]`);
CQCode.emoji = (id: number) => new CQCodeString(`[CQ:emoji,id=${id}]`);
CQCode.bface = (id: number) => new CQCodeString(`[CQ:bface,id=${id}]`);
CQCode.sface = (id: number) => new CQCodeString(`[CQ:sface,id=${id}]`);
CQCode.image = (file: string) => new CQCodeString(`[CQ:image,file=${file}]`);
CQCode.record = (file: string, magic?: boolean) => new CQCodeString(`[CQ:record,file=${file}${magic ? `,magic=${magic}` : ''}]`);
CQCode.at = (qq: number) => new CQCodeString(`[CQ:at,qq=${qq}]`);
CQCode.rps = (type?: 1 | 2 | 3) => new CQCodeString(`[CQ:rps${type ? `,type=${type}` : ''}]`);
CQCode.dice = (type?: 1 | 2 | 3 | 4 | 5 | 6) => new CQCodeString(`[CQ:dice${type ? `,type=${type}` : ''}]`);
CQCode.shake = () => new CQCodeString(`[CQ:shake]`);
CQCode.anonymous = (ignore?: boolean) => new CQCodeString(`[CQ:anonymous${ignore ? `,ignore=${ignore}` : ''}]`);
CQCode.music = (type: string, ...args: [number] | [string, string, string, string?, string?]) => {
  if (type === 'custom') {
    const [url, audio, title, content, image] = args;
    return new CQCodeString(`[CQ:music,type=custom,url=${url},audio=${audio},title=${title}\
${content ? `,content=${content}` : ''}${image ? `,image=${image}` : ''}]`);
  }
  return new CQCodeString(`[CQ:music,type=${type},id=${args[0]}]`);
};
CQCode.share = (url: string, title: string, content?: string, image?: string) =>
  new CQCodeString(`[CQ:share,url={1},title={2}${content ? `,content=${content}` : ''}${image ? `,image=${image}` : ''}]`);
