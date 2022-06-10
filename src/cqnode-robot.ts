// import PluginManager from './plugin-manager';
import WorkpathManager from './workpath-manager';
import { checkConfig } from './util';
import OicqConnector, { OicqConfig } from './connector-oicq';
import { FunctionModule, FunctionModuleInstance, moduleInit } from './module';
import EventContextBuilderMap, { CQNodeEventContext } from './module/event-context';
import CQEventType, { CQEvent } from './connector-oicq/event-type';

export interface CQNodeConfig {
  connector: OicqConfig;
  /** 管理员 @todo 后续用权限系统代替 */
  admin?: number[];
  /** 加载的模块 */
  modules?: Array<FunctionModule | [FunctionModule, any?]>;
  /** 加载的插件 */
  plugins?: any[];
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
  /** inf是否已获取 */
  inited: boolean;
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

  // pluginManager: PluginManager;

  connect: OicqConnector;

  modules: FunctionModuleInstance[];

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  inf = { inited: false, CQNodeVersion: require('../package.json').version } as CQNodeInf;

  constructor(config: CQNodeConfig) {
    this.config = checkConfig(config);
    this.workpathManager = new WorkpathManager(this.config.workpath || '.cqnode');
    // this.pluginManager = new PluginManager(this);
    this.connect = config.devConnect || new OicqConnector(this.config.connector);

    this.init();
  }

  private async init() {
    console.log('cqnode: 初始化中......');
    await this.connect.init();
    await this.workpathManager.init();

    // this.config.plugins.forEach(plg => this.pluginManager.registerPlugin(plg));

    this.modules = await Promise.all(this.config.modules?.map(mod => {
      const m = Array.isArray(mod) ? mod : [mod];
      return moduleInit(m[0], m[1], this);
    }) || []);

    this.connect.on('event', async <T extends CQEventType>(data: { eventName: T; event: CQEvent<T> }) => {
      for (const mod of this.modules) {
        const ctxBuilder: (ev: CQEvent<T>, cqnode: CQNodeRobot) => CQNodeEventContext<T> = EventContextBuilderMap[data.eventName];
        const ctx = ctxBuilder(data.event, this);
        try {
          const end = await mod.eventProcessor.emit(data.eventName, ctx as CQNodeEventContext<T>);
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
}
