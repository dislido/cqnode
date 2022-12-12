# module
模块用于处理机器人接收到的各种事件

CQNode的模块使用函数来编写，此函数接收两个参数，分别为模块上下文和模块设置

```typescript
interface FunctionModule {
  (mod: FunctionModuleCtx, config: any): void;
}
```

## FunctionModuleCtx
模块上下文，用于实现模块的各种功能

### `FunctionModuleCtx.setMeta(inf: CQNodeModuleMeta): void`
设置模块基本信息，建议在模块代码开头进行设置，可以多次调用来合并基本信息项，但`packageName`不应发生变化

__参数__
- inf: CQNodeModuleMeta
```typescript
interface CQNodeModuleMeta {
  /** 模块包名，名称中不能包含无法作为文件名的字符(/除外) */
  packageName: string;
  /** 模块名 */
  name?: string;
  /** 模块帮助信息 */
  help?: string;
  /** 模块简介 */
  description?: string;
  /** 模块导出，可通过cqnode.requireModule(packageName)获取模块导出内容 */
  exports?: any;
  [key: string]: any;
}
```

### `FunctionModuleCtx.on<T extends CQEventType>(eventName: T, listener: CQEventListener<T>, options?: EventProcessorOptions): () => void;`
监听事件

__参数__
- `eventName: CQEventType`
见[CQEventType](./cqevent)
- `listener: CQEventListener`
```typescript
/**
 * 事件监听函数
 */
type CQEventListener<T extends CQEventType> = (ctx: CQNodeEventContext<T>) => any;
```
CQNodeEventContext包含事件中的各种信息，根据事件类型有所不同，其公共属性为：
```typescript
interface commonEventContext<T extends CQEventType> {
  event: CQEvent<T>; // 事件的原始event对象
  end: boolean; // 该事件是否已处理结束
  cqnode: CQNodeRobot; // 当前cqnode实例
  mod: FunctionModuleInstance; // 正在处理此事件的模块
  eventType: T; // 事件类型
  [key: string]: any;
}
```
- `options: EventProcessorOptions`
```typescript
interface EventProcessorOptions {
  /** 处理群/讨论组消息是否需要atme标识来触发(默认true) */
  atme?: boolean;
  /** 忽略自己发送的消息(默认true) */
  ignoreSelf?: boolean;
}
```

__返回值__
返回一个用于取消监听的函数


## config
加载模块时传入的配置信息，由模块自行定义
