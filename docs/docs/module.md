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
> 消息处理
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
模块信息，在[`constructor`](#moduleconstructor)中设置，提供帮助信息和一些其他功能
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

## module.onEvent

## module.onMessage

## module.onPrivateMessage

## module.onGroupMessage

## module.onDiscussMessage

## module.onNotice

## module.onGroupUploadNotice

## module.onGroupAdminNotice

## module.onGroupDecreaseNotice

## module.onGroupIncreaseNotice

## module.onFriendAddNotice

## module.onRequest

## module.onFriendRequest

## module.onGroupRequest

## module.getFilepath
