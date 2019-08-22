# CQNode.Plugin
CQNode插件，提供了CQNode中的一些钩子，可以灵活地操纵机器人的各个行为细节，Plugin有着与Module相似的创建方法，都支持类和Factory两种创建方式：
```javascript
class MyPlugin extends CQNode.Plugin {
  onEventReceived(data) {
    return true;
  }
}
```
```javascript
const pf = new CQNode.Plugin.Factory()
  .onEventReceived(data => true)
  .createConstructor();
```

> [`onEventReceived`](#pluginoneventreceived) 接收到事件  
> [`onResponse`](#pluginonresponse) 响应事件  
> [`onRequestAPI`](#pluginonrequestapi) 调用API  

## 钩子函数
所有的钩子函数都只有一个参数`data`，里面包含了该事件相关的内容，对`data`对象的修改会影响到事件本身  

钩子函数可选的返回值：
- `false` 拦截此事件
- `true` 应用对`data`的修改，并让事件继续进行
- `object` 将替换`data`，并让事件继续进行
- `undefind` 同`true`
- 返回其他类型的值`a`时，将认为返回了与`a`对应的`boolean`值（`!!a`）


## plugin.onEventReceived
在接收到事件时触发

```typescript
onEventReceived(data: {
  eventName: EventName;
  event: CQEvent.Event;
})
```
- `eventName` 接收到的事件名，是下列事件名之一：
  - `PrivateMessage`
  - `DiscussMessage`
  - `GroupMessage`
  - `GroupUploadNotice`
  - `GroupAdminNotice`
  - `GroupDecreaseNotice`
  - `GroupIncreaseNotice`
  - `FriendAddNotice`
  - `FriendRequest`
  - `GroupRequest`
  - `LifecycleMeta`
  - `HeartbeatMeta`
- `event` 事件对象

```javascript
/** 
 * 屏蔽用户QQ号114514的消息
 */
onEventReceived(data) {
  if (data.eventName.endsWith('Message')) {
    if (data.event.userId === 114514) return false;
  }
  return true;
}
```

## plugin.onResponse
在Module响应事件时或所有Module都不处理该事件时触发  
```typescript
onResponse(data: {
  event: CQEvent.Event;
  originalResponse: http.ServerResponse;
  body: object;
  handlerModule?: CQNodeModule;
})
```
- __readonly__ `event` 事件的`Event`对象
- __readonly__ `originalResponse` 原始`ServerResponse`对象
- `body` 将要进行响应的responseBody内容
- __readonly__ `handlerModule` 处理该事件的Module，若为`undefined`，则没有Module处理此事件

```javascript
const { util } = require('@dislido/cqnode');
const { eventType } = util;
/**
 * 在回复消息时添加小尾巴
 */
onResponse(data) {
  if (eventType.isMessage(data.event)) {
    if (data.body.reply) data.body.reply += '\n  来自CQNode'；
  }
  return true;
}
```

## plugin.onRequestAPI
在Module调用API时触发（即使用`this.cqnode.api`时）
```typescript
onRequestAPI(data: {
  caller: CQNodeModule;
  apiName: keyof typeof CQAPI;
  params: Parameters<CQAPI[keyof CQAPI]>;
})
```

- __readonly__ `caller` 调用API的模块
- `apiName` 调用的API函数名
- `params` 传递给API函数的参数数组

```javascript
/**
 * 将所有群组踢人请求修改为禁言1小时
 */
onRequestAPI(data) {
  if (data.apiName === 'setGroupKick') {
    data.apiName = 'setGroupBan';
    data.params[2] = 3600;
  }
  return true;
}
```
