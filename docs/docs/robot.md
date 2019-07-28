# CQNode.Robot
机器人实例，只能由`CQNode.createRobot()`创建
- `Robot.modules`: [`CQNode.Module[]`](/cqnode/docs/module) 加载的模块
- `Robot.api`: [`CQNodeAPI`](/cqnode/docs/api) CQNode提供的API, 基本与[CQ HTTP API](https://cqhttp.cc/docs/#/API)一致，此外还附加了一些API
- `Robot.config`: [`CQNodeConfig`](#cqnodeconfig) 配置信息，是对`ConfigObject`进行处理后的对象
- `Robot.inf`: [`CQNodeInf`](#cqnodeinf) CQNode信息

## CQNodeConfig
统一了类型后的配置对象，各属性意义与[`ConfigObject`](/cqnode/docs/createrobot#configobject)一致
```typescript
interface CQNodeConfig {
  admin: number[];
  modules: Module[];
  workpath: string;
  connector: {
    LISTEN_PORT: number;
    API_PORT: number;
    TIMEOUT: number;
  }
  atmeTrigger: Array<string | true>;
}
```

## CQNodeInf
CQNode全局信息对象
```typescript
interface CQNodeInf {
  /** inf是否已获取 */
  inited: boolean,
  /** 当前登录号信息 */
  loginInfo: {
    nickname: string; // 昵称
    userId: number; // QQ号
  };
  /** 插件运行状态 */
  status: {
    /** 当前 QQ 在线，null 表示无法查询到在线状态 */
    online: boolean;
    /** HTTP API 插件状态符合预期，意味着插件已初始化，内部插件都在正常运行，且 QQ 在线 */
    good: boolean;
  };
  /** 酷Q 及 HTTP API 插件的版本信息 */
  versionInfo: {
    /** 酷Q 根目录路径 */
    coolqDirectory: string;
    /** 酷Q 版本，air 或 pro */
    coolqEdition: string;
    /** HTTP API 插件版本，例如 2.1.3 */
    pluginVersion: string;
    /** HTTP API 插件 build 号 */
    pluginBuildNumber: number;
    /** HTTP API 插件编译配置，debug 或 release */
    pluginBuildConfiguration: string;
  };
  /** 群列表 */
  groupList: CQHTTP.GetGroupListResponseData[];
  /* CQHTTP.GetGroupListResponseData
    {
      // 群号
      group_id: number;
      // 群名称
      group_name: string;
    }
  */
}
```
