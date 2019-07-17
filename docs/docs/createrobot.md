# CQNode.createRobot
```javascript
CQNode.createRobot(ConfigObject);
```
创建并启动机器人  

- `ConfigObject`: [`ConfigObject`](#configobject) CQNode的配置对象

返回创建的机器人实例[`CQNode.Robot`](#cqnoderobot)

## ConfigObject
CQNode配置对象，各属性默认值如下
```javascript
{
  /** 
   * 管理员
   * @type {number | number[]}
   */
  admin: undefined, // 不设置管理员
  // admin: 123456789, // 设置管理员qq号
  // admin: [123456789, 987654321], // 设置多个管理员

  /**
   * 加载的模块
   * @type {CQNode.Module[]}
   */
  modules: [],

  /**
   * 数据文件夹，一些数据缓存和配置会存放在此文件夹下
   * @type {string}
   */
  workpath: '.cqnode', // 在当前目录下的.cqnode文件夹中存放数据
  // workpath: 'D:/cqnode', // 在D:/cqnode文件夹中存放数据

  /**
   * CoolQ HTTP API 连接配置
   * 应与CoolQ HTTP API 插件的相关配置一致
   * 参考 [CoolQ HTTP API配置](https://cqhttp.cc/docs/#/Configuration)
   */
  connector: {
    /**
     * 事件监听接口
     * 对应HTTP API配置的post_url项
     */
    LISTEN_PORT: 8080,
    /**
     * HTTP API接口  
     * 对应HTTP API配置的port项
     */
    API_PORT: 5700,
    /** 事件处理超时时长（毫秒） */
    TIMEOUT: 10000,
  },

  /**
   * atme判断字符串  
   * 以该字符串开头的信息会被认为at了本机器人  
   * 默认使用QQ的at  
   * 空字符串表示将任何消息当作at了本机器人
   * @type {string | true | Array<string | true>}
   */
  prompt: true, // 将@本账号开头的消息作为atme
  // prompt: '-', // 将-开头的消息作为atme消息
  // prompt: [true, '-', '.'], // 设置多个atme判断规则
}
```

## CQNode.Robot
机器人实例，只能由`CQNode.createRobot()`创建
- `Robot.modules`: [`CQNode.Module[]`](/cqnode/docs/module) 加载的模块
- `Robot.api`: [`CQNodeAPI`](/cqnode/docs/api) CQNode提供的API, 基本与[CQ HTTP API](https://cqhttp.cc/docs/#/API)一致，此外还附加了一些API
- `Robot.config`: [`CQNodeConfig`](#cqnodeconfig) 配置信息，是对`ConfigObject`进行处理后的对象
- `Robot.inf`: [`CQNodeInf`](#cqnodeinf) CQNode信息

## CQNodeConfig
统一了类型后的配置对象，各属性意义与[`ConfigObject`](#configobject)一致
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
  prompt: Array<string | true>;
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
