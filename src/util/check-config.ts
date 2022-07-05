import { CQNodeConfig } from '../cqnode-robot';
import { FunctionModule } from '../module';

/**
 * 检查配置项
 * @param config 配置对象
 */
export default function checkConfig(config: any) {
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
