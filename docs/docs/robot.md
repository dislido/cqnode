# CQNode.Robot
机器人实例，由`createRobot()`创建
- `cqnode.modules`: [`CQNode.Module[]`](./module) 已加载的模块
- `cqnode.plugins`: [`CQNode.Plugin[]`](./plugin) 已加载的插件
- `cqnode.api`: [`CQNodeAPI`](./api) CQNode提供的API, 与OICQ Client中的api一致
- `cqnode.config`: [`CQNodeConfig`](#cqnodeconfig) 配置信息

## CQNodeConfig
CQNode配置，即createRobot的参数
```typescript
interface CQNodeConfig {
  connector: OicqConfig;
  /** 机器人管理员 */
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

```

## Robot.CQNode
CQNode的引用
```javascript
const CQNode = require('@dislido/CQNode');

CQNode.createRobot({}).constructor.CQNode === CQNode; // true
```