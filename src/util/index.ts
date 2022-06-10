import CQNodeRobot, { CQNodeConfig } from '../cqnode-robot';
import { FunctionModule } from '../module';
// import CQNodeModule from './robot-module';
// import CQNodePlugin from './robot-plugin';

export { segment } from 'oicq';

/**
 * 检查配置项
 * @param config 配置对象
 */
export function checkConfig(config: any) {
  const cfg = {
    admin: [] as number[],
    modules: [] as FunctionModule[],
    plugins: [] as any[],
    atmeTrigger: [true] as Array<string | true>,
    workpath: '.cqnode',
    connector: {},
    ...config,
  };
  if (!Array.isArray(cfg.admin)) cfg.admin = [cfg.admin];
  if (cfg.admin.some((it: any) => typeof it !== 'number')) {
    throw new Error('config.admin 的类型必须是number[]');
  }

  if (!Array.isArray(cfg.atmeTrigger) || cfg.atmeTrigger.some((it: any) => it !== true && typeof it !== 'string')) {
    throw new Error('config.atmeTrigger 的类型必须是 Array<string | true>');
  }

  cfg.workpath = `${cfg.workpath}`;

  if (!cfg.connector?.account) throw new Error('config.connector.account 必须提供');

  return cfg as CQNodeConfig;
}

export const nullCQNode = new Proxy({}, {
  get() {
    throw new Error('CQNode Error: 模块/插件未运行，不能使用CQNode');
  },
}) as CQNodeRobot;

type CQCodeData = {
  type: string;
  data: {
    [key: string]: string;
  };
};

/**
 * 生成CQ码
 * @deprecated
 * @todo 改用oicq提供
 */
export function CQCode(type: string, data: { [key:string]: string | number | boolean } = {}) {
  const dataEntries = Object.entries(data);
  return new CQCode.String(`[CQ:${type}${dataEntries.length > 0 ? ',' : ''}${dataEntries.map(it => it.join('=')).join(',')}]`);
}

class CQCodeString extends String {
  parse(this: string) {
    return CQCode.parseCQCodeString(this);
  }
}

CQCode.String = CQCodeString;

CQCode.parseCQCodeString = (code: string) => {
  const ret = /\[CQ:([^,]+)(.*)\]/.exec(code);
  if (!ret) return null;
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
    });
  }
  return result;
};
/*
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
CQCode.shake = () => new CQCodeString('[CQ:shake]');
CQCode.anonymous = (ignore?: boolean) => new CQCodeString(`[CQ:anonymous${ignore ? `,ignore=${ignore}` : ''}]`);
CQCode.music = (type: string, ...args: [number] | [string, string, string, string?, string?]) => {
  if (type === 'custom') {
    const [url, audio, title, content, image] = args;
    return new CQCodeString(`[CQ:music,type=custom,url=${url},audio=${audio},title=${title}\
${content ? `,content=${content}` : ''}${image ? `,image=${image}` : ''}]`);
  }
  return new CQCodeString(`[CQ:music,type=${type},id=${args[0]}]`);
};
CQCode.share = (url: string, title: string, content?: string, image?: string) => new CQCodeString(`[CQ:share,url={1},title={2}${content ? `,content=${content}` : ''}${image ? `,image=${image}` : ''}]`);
