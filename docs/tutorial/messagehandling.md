# 事件处理
## 消息处理函数

在上一节中，如果你不是复制代码而是手写`Repeat`模块的话，当你写完`CQEventType.`时，应该已经从代码提示中看到各种事件类型了  
本节我们以处理群消息为例，只需将监听到事件类型改为`CQEventType.messageGroup`

```javascript
const { createRobot } = require('@dislido/CQNode');

const RepeatGroup = mod => {
  mod.setMeta({
    packageName: 'repeatGroup',
  });
  mod.on(CQEventType.messageGroup, async ctx => {
    ctx.reply(`收到消息: ${ctx.textMessage}`);
    return true;
  });
};


createRobot({
  connector: {
    account: 114514,
    password: '1919810',
  },
  modules: [RepeatGroup],
});
```

## atme
在群聊天中，通常只在需要时才会让机器人处理你的消息，机器人会忽略群成员间的正常聊天，此时可以用`atme`监听选项来判断一条消息是否at了本机器人，默认情况下，此选项的值是`true`

```javascript
const RepeatGroup = mod => {
  mod.setMeta({
    packageName: 'repeatGroup',
  });
  mod.on(CQEventType.messageGroup, async ctx => {
    ctx.reply(`收到消息: ${ctx.textMessage}`);
    return true;
  }, { atme: true });
};
```

> 预计行为：  
> __[群聊]__  
> __user1__: aaa   
> __user2__: bbb   
> __user1__: `@robot` 123   
> __robot__: `@user1` 收到消息: 123   

默认情况下，CQNode使用@作为`atme`判断条件，以@本机器人开头的消息的`atme`才会为`true`  
可以在[配置](../docs/createrobot#configobject)中修改`atmeTrigger`来修改`atme`判断条件

```javascript
createRobot({
  modules: [RepeatGroup],
  atmeTrigger: [true, '-'], // <- true代表默认的@， 我们增加一个-作为atme判断条件
});
```

> 预计行为：  
> __[群聊]__    
> __user1__: aaa  
> __user2__: bbb  
> __user1__: `@robot` 123  
> __robot__: `@user1` 收到消息: 123  
> __user2__: -456  
> __robot__: `@user2` 收到消息: 456  


## 返回值
事件处理函数有以下几种返回值
- 任何boolean值为`true`的返回值，代表本模块处理了此事件，阻止事件继续向其他模块传递
- 任何boolean值为`false`的返回值，代表本模块不处理此事件，事件会继续向其他模块传递

```javascript
const RepeatGroup = mod => {
  mod.setMeta({
    packageName: 'repeatGroup',
  });
  mod.on(CQEventType.messageGroup, async ctx => {
    if (ctx.textMessage.includes('123')) return false; // 消息中包含123，则不复读此消息，让消息继续传递给其他模块
    if (ctx.textMessage.includes('111')) return true; // 消息中包含123，则不复读此消息，也不让消息流向下一个模块
    ctx.reply(`收到消息: ${ctx.textMessage}`);
    return true;
  });
};

const NextModule = mod => {
  mod.setMeta({
    packageName: 'nextModule',
  });
  mod.on(CQEventType.messageGroup, async ctx => {
    ctx.reply('RepeatGroup不处理此消息');
    return true;
  });
};

CQNode.createRobot({
  modules: [
    RepeatGroup,
    NextModule, // <- CQNode会按顺序传递消息
  ],
});
```

> 预计行为：  
> __[群聊]__  
> 
> __user__: 123  
> __robot__: MyModule不处理此消息  
>
> __user__: 111  
>
> __user__: `@robot` asdf  
> __robot__: `@user` 收到消息: asdf  

## 子事件
`messageGroup`是`message`事件的子事件，因此在收到`messageGroup`事件时，也会传递给`message`事件的处理函数
事件传递给一个模块时，会先传递给子事件处理函数，再传递给父事件处理函数
参考[消息处理](../docs/module#消息处理)

[下一步 API](./api)
