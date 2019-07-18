# CQNode.Module
CQNode功能模块基类，通过继承此类来编写模块，在代码提示中也能看到本页文档内容

> 属性
>> [`cqnode`](#modulecqnode) 模块绑定的CQNode  
>> [`isRunning`](#moduleisrunning) 模块是否处于运行状态  
>> [`inf`](#moduleinf) 模块信息  
>
> 构造函数
>> [`constructor`](#constructor)  
>
> 生命周期
>> [`onRun`](#moduleonrun) 模块启动  
>> [`onStop`](#moduleonstop) 模块停止  
>
> [消息处理](#消息处理)
>> [`onEvent`](#moduleonevent) 收到事件  
>> [`onMessage`](#moduleonmessage) 收到消息  
>> [`onPrivateMessage`](#moduleonprivatemessage) 收到私聊消息  
>> [`onGroupMessage`](#moduleongroupmessage) 收到群消息  
>> [`onDiscussMessage`](#moduleondiscussmessage) 收到讨论组消息  
>> [`onNotice`](#moduleonnotice) 收到通知  
>> [`onGroupUploadNotice`](#moduleongroupuploadnotice) 收到群文件上传通知  
>> [`onGroupAdminNotice`](#moduleongroupadminnotice) 收到群管理员变动通知  
>> [`onGroupDecreaseNotice`](#moduleongroupdecreasenotice) 收到群成员减少通知  
>> [`onGroupIncreaseNotice`](#moduleongroupincreasenotice) 收到群成员增加通知  
>> [`onFriendAddNotice`](#moduleonfriendaddnotice) 收到好友添加通知  
>> [`onRequest`](#moduleonrequest) 收到请求  
>> [`onFriendRequest`](#moduleonfriendrequest) 收到加好友请求  
>> [`onGroupRequest`](#moduleongrouprequest) 收到加群请求  
>
> api
>> [`getFilepath`](#modulegetfilepath) 获取本模块的数据文件目录  

## module.cqnode
模块绑定的[CQNode.Robot](/cqnode/docs/robot)实例，仅在模块已启动时可访问，否则为`undefined`
```javascript
class MyModule extends CQNode.Module {
  getCQNode() {
    if (this.isRunning) return this.cqnode;
  }
}
```

## module.isRunning
当前模块是否运行中，会在[`onRun`](#moduleonrun)被调用前设为`true`,在[`onStop`](#moduleonstop)被调用后设为`false`

## module.inf
模块信息，在[`constructor`](#constructor)中设置，提供帮助信息和一些其他功能
```typescript
interface Inf {
  /** 模块包名，应保证唯一，名称中不能包含无法作为文件名的字符，`/`会被替换为`.` */
  packageName: string;
  /** 模块名 */
  name: string;
  /** 模块帮助信息 */
  help: string;
  /** 模块描述 */
  description: string;
}
```

## constructor
构造函数，在此处设置[`module.inf`](#moduleinf)
```javascript
class MyModule extends CQNode.Module {
  constructor() {
    super({
      packageName: '@myname/cqnode-module-mymodule',
      name: '我的模块',
      help: '模块帮助信息',
      description: '模块描述',
    });
  }
}
```

## module.onRun
`onRun()`会在模块启动后被调用一次，在此处进行一些初始化操作，如设置定时器，读取文件等
```javascript
onRun() {
  this.minute = 0;
  this.timer = setInterval(() => {
    this.cqnode.api.sendGroupMsg(this.group, `模块已启动${++this.minute}分钟`);
  }, 60000);
}
```

## module.onStop
`onStop()`会在模块停止前被调用一次，在此处进行清除定时器，释放资源等清理操作
```javascript
onStop() {
  clearInterval(this.timer);
}
```

## 消息处理
当模块接收到消息事件时，会触发相应的消息处理函数，若没有提供该处理函数，则会触发更上一层级的处理函数，直到`onEvent()`，处理函数层级关系如下
```
onEvent
  onMessage
    onPrivateMessage
    onGroupMessage
    onDiscussMessage
  onNotice
    onGroupUploadNotice
    onGroupAdminNotice
    onGroupDecreaseNotice
    onGroupIncreaseNotice
    onFriendAddNotice
  onRequest
    onFriendRequest
    onGroupRequest
```
如：接收到群消息时，首先会触发`onGroupMessage()`，如果该模块没有提供`onGroupMessage()`，则会触发`onMessage()`，若也没有提供，则触发`onEvent()`，如果`onEvent()`也没有提供，则该模块不处理此消息，消息继续传递给下一个模块

消息处理函数接收两个参数`event: CQEvent.Event`和`resp: CQResponse.Response`, `event`包含消息内容和其他数据，`resp`包含响应消息的方法

消息处理函数的返回值可以为`bool`,`void`,`CQResponse.Response`和它们对应的`Promise`对象  
若返回为`true`或`CQResponse.Response`，则代表该模块处理了这条消息，消息不会继续流向下一个模块  
若返回为`false`或`void`，则代表该模块不处理这条消息，消息继续流向下一个模块  
```javascript
class MyModule extends CQNode.Module {
  // 返回`CQResponse.Response`对象
  onMessage(event, resp) {
    return resp.reply('hello');
  }

  // 返回true
  onGroupMessage(event, resp) {
    resp.reply('hello');
    return true;
  }

  // 返回Promise<true>
  async onPrivateMessage(event, resp) {
    resp.reply('hello');
    return true;
  }
}
```


## module.onEvent
```typescript
onEvent(event: CQEvent.Event, resp: CQResponse.Response)
```

处理任何消息事件
### CQEvent.Event
- `postType`: `string` `'message'`: 收到消息  `'notice'`: 群、讨论组变动等通知类事件  `'request'`: 加好友请求、加群请求／邀请  `'meta_event'`: 元事件
- `time`: `number` 事件发生的时间戳
- `selfId`: `number` 收到消息的机器人 QQ 号

### CQResponse.Response
- `originalResponse`: [`http.ServerResponse`](http://nodejs.cn/api/http.html#http_class_http_serverresponse) 原始http response对象，通常情况下不建议直接调用此对象
- `responseBody`: `object` response响应数据，通常情况下不建议直接修改此对象内容


## module.onMessage
```typescript
onMessage(data: CQEvent.Message, resp: CQResponse.Message)
```
收到消息

### CQEvent.Message
实现了[`CQEvent.Event`](#cqeventevent)接口，还有以下额外的属性
- `postType`: `'message'`
- `messageType`: `string` 消息类型，`'group'`: 群消息 `'private'`: 私聊消息 `'discuss'`: 讨论组消息
- `messageId`: `number` 消息 ID 
- `userId`: `number` 发送者 QQ 号
- `message`: `string` 消息内容
- `rawMessage`: `string` 原始消息内容
- `font`: `number` 字体
- `sender`: `object` 发送人信息,不保证各字段存在和正确性
- `username`: `string` 发送人名称，会尽可能提供在聊天窗口显示的名称
- `atme`: `boolean` 是否at了本账号，私聊消息中总是为true
- `msg`: `string` 对message进行过trim操作，移除at信息部分等操作后的字符串

### CQResponse.Message
实现了[`CQResponse.Response`](#cqresponseresponse)接口，还有以下额外的方法

> `send(message: string, autoEscape?: boolean)`  
> 向消息来源私聊/群/讨论组发送消息，不使用response而是使用API发送消息  
> - `message` 回复信息  
> - `autoEscape` 消息内容是否作为纯文本发送（即不解析 CQ 码）  
>
> 返回`void`

> `reply(message: string, autoEscape?: boolean)`  
> 使用response响应回复消息  
> - `message` 回复信息  
> - `autoEscape` 消息内容是否作为纯文本发送（即不解析 CQ 码）  
> 
> 返回`this`

## module.onPrivateMessage
``` typescript
onPrivateMessage(data: CQEvent.PrivateMessage, resp: CQResponse.PrivateMessage)
```
收到私聊消息


## module.onGroupMessage
/** 收到群消息 */
  onGroupMessage(data: CQEvent.GroupMessage, resp: CQResponse.GroupMessage): Module.EventReturns;
```typescript

```

## module.onDiscussMessage
/** 收到讨论组消息 */
  onDiscussMessage(data: CQEvent.DiscussMessage, resp: CQResponse.DiscussMessage): Module.EventReturns;
```typescript

```

## module.onNotice
/** 收到通知 */
  onNotice(data: CQEvent.Notice, resp: CQResponse.Notice): Module.EventReturns;
  
```typescript

```
##module.onGroupUploadNotice
/** 收到群文件上传通知 */
  onGroupUploadNotice(data: CQEvent.GroupUploadNotice, resp: CQResponse.GroupUploadNotice): Module.EventReturns;
```typescript

```

## module.onGroupAdminNotice
/** 收到群管理员变动通知 */
  onGroupAdminNotice(data: CQEvent.GroupAdminNotice, resp: CQResponse.GroupAdminNotice): Module.EventReturns;
```typescript

```

## module.onGroupDecreaseNotice
/** 收到群成员减少通知 */
  onGroupDecreaseNotice(data: CQEvent.GroupDecreaseNotice, resp: CQResponse.GroupDecreaseNotice): Module.EventReturns;
```typescript

```

## module.onGroupIncreaseNotice
/** 收到群成员增加通知 */
  onGroupIncreaseNotice(data: CQEvent.GroupIncreaseNotice, resp: CQResponse.GroupIncreaseNotice): Module.EventReturns;
```typescript

```

## module.onFriendAddNotice
/** 收到好友添加通知 */
  onFriendAddNotice(data: CQEvent.FriendAddNotice, resp: CQResponse.FriendAddNotice): Module.EventReturns;
```typescript

```

## module.onRequest
/** 收到请求 */
  onRequest(data: CQEvent.Request, resp: CQResponse.Request): Module.EventReturns;
```typescript

```

## module.onFriendRequest
/** 收到加好友请求 */
  onFriendRequest(data: CQEvent.FriendRequest, resp: CQResponse.FriendRequest): Module.EventReturns;
```typescript

```

## module.onGroupRequest
/** 收到加群请求 */
  onGroupRequest(data: CQEvent.GroupRequest, resp: CQResponse.GroupRequest): Module.EventReturns;
```typescript

```

## module.getFilepath
