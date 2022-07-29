import path from 'path';
import WorkpathManager from './workpath-manager';
import checkConfig from './util/check-config';
import OicqConnector, { OicqConfig } from './connector-oicq';
import { FunctionModule, FunctionModuleInstance, moduleInit } from './module';
import EventContextBuilderMap, { CQNodeEventContext } from './module/event-context';
import CQEventType, { CQEvent } from './connector-oicq/event-type';
import pluginInit, { FunctionPlugin, FunctionPluginInstance } from './plugin';
import { CQNodeHook, CQNodeHookDataMap } from './plugin/hook-processor';
import { proxyCtx } from './util/proxy';

export interface CQNodeConfig {
  connector: OicqConfig;
  /** 机器人管理员, 此列表中的用户获得auth plugin的superAdmin权限 */
  admin?: number[];
  /** 加载的模块, [FunctionModule，config, metaConfig] */
  modules?: Array<FunctionModule | [FunctionModule, any?, any?]>;
  /** 加载的插件, [FunctionPlugin，config, metaConfig] */
  plugins?: Array<FunctionPlugin | [FunctionPlugin, any?, any?]>;
  /** 数据文件夹 */
  workpath?: string;
  /**
   * atme判断字符串
   * 以该字符串开头的信息会被认为at了本机器人，并在消息中添加atme=true标识
   * 默认使用QQ的at
   * 空字符串表示将任何消息当作at了本机器人
   */
  atmeTrigger?: Array<string | true>;
}

/** CQNode运行时信息 */
interface CQNodeInf {
  /** api.getLoginInfo, 当前登录号信息 */
  loginInfo: {
    nickname: string;
    userId: number;
  };
  CQNodeVersion: string;
}

export default class CQNodeRobot {
  static CQNode: any;

  config: CQNodeConfig;

  workpathManager: WorkpathManager;

  connect: OicqConnector;

  modules: FunctionModuleInstance[];

  plugins: FunctionPluginInstance[];

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  inf = { CQNodeVersion: require('../package.json').version } as CQNodeInf;

  constructor(config: CQNodeConfig) {
    this.config = checkConfig(config);
    this.workpathManager = new WorkpathManager(this.config.workpath || '.cqnode');
  }

  async init() {
    console.log('CQNode: 初始化中......');

    await this.workpathManager.init();

    this.plugins = await Promise.all(this.config.plugins?.map(plg => {
      const m = Array.isArray(plg) ? plg : [plg];
      return pluginInit(m[0], m[1], m[2], this);
    }) || []);

    const connector = await this.emitHook(CQNodeHook.beforeInit, {
      connectorClass: OicqConnector,
      connectorConfig: {
        data_dir: path.resolve(this.config.workpath || '.cqnode', 'oicq'),
        ...this.config.connector,
      },
    });

    if (!connector?.connectorClass) {
      throw new Error('CQNode初始化失败，无connector');
    }

    // eslint-disable-next-line new-cap
    this.connect = new connector.connectorClass(connector?.connectorConfig);

    await this.connect.init();

    this.modules = await Promise.all(this.config.modules?.map(mod => {
      const m = Array.isArray(mod) ? mod : [mod];
      return moduleInit(m[0], m[1], m[2], this);
    }) || []);

    this.connect.on('event', async <T extends CQEventType>(data: { eventName: T; event: CQEvent<T> }) => {
      const mods = [...this.modules];

      const beforeEventProcessData = await this.emitHook(CQNodeHook.beforeEventProcess, {
        ctxBuilder: EventContextBuilderMap[data.eventName],
        mods,
        eventType: data.eventName,
        event: data.event,
      });
      if (!beforeEventProcessData) return;
      const evProcData = beforeEventProcessData;

      for (let i = 0; i < mods.length; i++) {
        const mod = mods[i];
        const beforeModuleEventProcessData = await this.emitHook(CQNodeHook.beforeModuleEventProcess, {
          ctx: evProcData.ctxBuilder(data.event, mod, this),
          eventType: evProcData.eventType,
          mod,
        });
        if (!beforeModuleEventProcessData) continue;
        const { ctx, eventType } = beforeModuleEventProcessData;

        const ctxProxy = proxyCtx(ctx, mod, this);

        try {
          const end = await mod.eventProcessor.emit(eventType, ctxProxy as CQNodeEventContext<T>);
          if (end) ctx.end = true;
        } catch (e) {
          console.error(e);
        }
        if (ctx.end || i === mods.length - 1) {
          this.emitHook(CQNodeHook.afterEventProcess, {
            ctx,
            processMod: ctx.end ? mod : undefined,
          });
          break;
        }
      }
    });
    this.emitHook(CQNodeHook.afterInit, {});
    console.log('cqnode: 初始化完成');
  }

  async emitHook<T extends CQNodeHook>(hookName: T, data: CQNodeHookDataMap[T]) {
    let currData: CQNodeHookDataMap[T] | null = data;
    for (const plg of this.plugins) {
      currData = await plg.hookProcessor.emit(hookName, data);
      if (!currData) return null;
    }
    return currData;
  }

  emitSyncHook<T extends CQNodeHook>(hookName: T, data: CQNodeHookDataMap[T]) {
    let currData: CQNodeHookDataMap[T] | null = data;
    for (const plg of this.plugins) {
      currData = plg.hookProcessor.emitSync(hookName, data);
      if (currData instanceof Promise) throw new Error(`plugin error: ${hookName} 不支持异步hook`);
      if (!currData) return null;
    }
    return currData;
  }

  requireModule(packageName: string) {
    const mod = this.modules.find(it => it.meta.packageName === packageName);
    if (!mod) throw new Error(`module ${packageName} not found`);
    return mod.meta.exports;
  }

  requirePlugin(packageName: string) {
    const plg = this.plugins.find(it => it.meta.packageName === packageName);
    if (!plg) throw new Error(`plugin ${packageName} not found`);
    return plg.meta.exports;
  }
}
