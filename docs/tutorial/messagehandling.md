# 消息处理

在开始本节前，建议先阅读[代码提示与类型检查](../docs/typeinferrence)，代码提示对学习本章的内容有很大帮助

## 消息处理函数

在上一节中，如果你不是复制代码而是手写`Repeat`模块的话，当你写完`onMessage`的`on`两个字母时，应该已经从代码提示中看到模块提供的消息处理函数列表了  
如果没看到也没关系，你也可以在[CQNode.Module](../docs/module)中查看消息处理函数的文档  
本章我们以处理群消息为例，在[`onGroupMessage`](../docs/module#moduleongroupmessage)中编写代码  

```javascript
const CQNode = require('@dislido/CQNode');

class MyModule extends CQNode.Module {
  onGroupMessage(data, resp) {
    return resp.reply(`收到消息: ${data.msg}`);
  }
}

CQNode.createRobot({
  modules: [new MyModule()],
});
```

## atme

在群聊天中，通常只在需要时才会让机器人处理你的消息，机器人会忽略群成员间的正常聊天，此时可以用`atme`来判断一条消息是否需要处理

```javascript
class MyModule extends CQNode.Module {
  onGroupMessage(data, resp) {
    if (!data.atme) return false; // <- 若atme为false，则返回false，不处理此消息

    return resp.reply(`收到消息: ${data.msg}`);
  }
}
```

> 预计行为：  
> - [群聊]  
> __user1__: aaa   
> __user2__: bbb   
> __user1__: `@robot` 123   
> __robot__: `@user1` 收到消息: 123   

默认情况下，CQNode使用@作为`atme`判断条件，以@本机器人开头的消息的`atme`才会为`true`  
可以在[配置](../docs/createrobot#configobject)中修改`atmeTrigger`来修改`atme`判断条件

```javascript
class MyModule extends CQNode.Module {
  onGroupMessage(data, resp) {
    if (!data.atme) return false;

    return resp.reply(`收到消息: ${data.msg}`);
  }
}

CQNode.createRobot({
  modules: [new MyModule()],
  atmeTrigger: [true, '-'], // <- true代表默认的@， 我们增加一个-作为atme判断条件
});
```

> 预计行为：  
> - [群聊]  
> __user1__: aaa  
> __user2__: bbb  
> __user1__: `@robot` 123  
> __robot__: `@user1` 收到消息: 123  
> __user2__: -456  
> __robot__: `@user2` 收到消息: 456  

_在私聊中，`atme`总是为`true`_

