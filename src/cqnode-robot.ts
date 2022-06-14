// import PluginManager from './plugin-manager';
import WorkpathManager from './workpath-manager';
import { checkConfig } from './util';
import OicqConnector, { OicqConfig } from './connector-oicq';
import { FunctionModule, FunctionModuleInstance, moduleInit } from './module';
import EventContextBuilderMap, { CQNodeEventContext } from './module/event-context';
import CQEventType, { CQEvent } from './connector-oicq/event-type';
import pluginInit, { FunctionPlugin, FunctionPluginInstance } from './plugin';
import { CQNodeHook, CQNodeHookData } from './plugin/hook-processor';

export interface CQNodeConfig {
  connector: OicqConfig;
  /** 管理员 @todo 后续用权限系统代替 */
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

  devConnect?: any;
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
    this.init();
  }

  private async init() {
    console.log('CQNode: 初始化中......');

    await this.workpathManager.init();

    this.plugins = await Promise.all(this.config.plugins?.map(plg => {
      const m = Array.isArray(plg) ? plg : [plg];
      return pluginInit(m[0], m[1], m[2], this);
    }) || []);

    const connector = await this.emitHook(CQNodeHook.beforeInit, {
      connectorClass: OicqConnector,
      connectorConfig: this.config.connector,
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
      });
      if (!beforeEventProcessData) return;
      const evProcData = beforeEventProcessData;

      for (const mod of mods) {
        const beforeModuleEventProcessData = await this.emitHook(CQNodeHook.beforeModuleEventProcess, {
          ctx: evProcData.ctxBuilder(data.event, this),
          eventType: evProcData.eventType,
          mod,
        });
        if (!beforeModuleEventProcessData) continue;
        const { ctx, eventType } = beforeModuleEventProcessData;

        try {
          const end = await mod.eventProcessor.emit(eventType, ctx as CQNodeEventContext<T>);
          if (end) ctx.end = true;
        } catch (e) {
          console.error(e);
        }
        if (ctx.end) return;
      }
    });
    // this.pluginManager.emit('onReady', {});
    console.log('cqnode: 初始化完成');
  }

  async emitHook<T extends CQNodeHook>(hookName: T, data: CQNodeHookData[T]) {
    let currData: CQNodeHookData[T] | null = data;
    for (const plg of this.plugins) {
      currData = await plg.hookProcessor.emit(hookName, data);
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
