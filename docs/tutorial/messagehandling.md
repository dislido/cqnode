# 消息处理

在开始本章前，建议先阅读[代码提示与类型检查](/cqnode/docs/typeinferrence)，代码提示对学习本章的内容有很大帮助

## 消息处理函数

在上一章中，如果你不是复制代码而是手写`Repeat`模块的话，当你写完`onMessage`的`on`两个字母时，应该已经从代码提示中看到模块提供的消息处理函数列表了  
如果没看到也没关系，你也可以从[CQNode.Module](/cqnode/docs/module)中查看消息处理函数的文档  
本章我们以处理群消息为例，在[`onGroupMessage`](/cqnode/docs/module#moduleongroupmessage)中编写代码  

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