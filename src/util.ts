/**
 * 检查配置项
 * @param {object} config 配置对象
 */
export function checkConfig(config: any) {
  const cfg = {
    admin: [],
    listenGroups: [],
    modules: [],
    plugins: [],
    lemocURL: 'ws://127.0.0.1:25303',
    prompt: {},
    workpath: '.cqnode',
    ...config,
  };
  if (!config) throw new Error('config is required');
  if (!cfg.qqid) throw new Error('config.qqid is required');
  if (typeof cfg.workpath !== 'string' || !cfg.workpath) throw new TypeError('illegal config.workpath');
  if (typeof cfg.prompt !== 'object') throw new TypeError('illegal config.prompt');
  cfg.prompt = {
    group: true,
    svc: '~',
    admin: '~$',
    ...cfg.prompt,
  };
  if (cfg.prompt.group === true) cfg.prompt.group = `[CQ:at,qq=${cfg.qqid}]`;
  if (cfg.prompt.svc === true) cfg.prompt.svc = `[CQ:at,qq=${cfg.qqid}]`;
  if (cfg.prompt.admin === true) cfg.prompt.admin = `[CQ:at,qq=${cfg.qqid}]`;
  return cfg;
}

export function toUnderScoreCase(obj: object): object;
export function toUnderScoreCase(str: string): string;
export function toUnderScoreCase(t: any): any {
  if (typeof t === 'string') return t.replace(/[(A-Z)]/g, it => `_${it.toLowerCase()}`);
  return Object.entries(t).reduce((prev: { [key: string]: any }, [key, value]) => {
    prev[key.replace(/[(A-Z)]/g, it => `_${it.toLowerCase()}`)] = value;
    return prev;
  }, {});
}
