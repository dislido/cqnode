# 第一个模块
这是主页上的第一个示例，一个简单的复读机  
`/index.js`
```javascript
const CQNode = require('@dislido/CQNode');

class Repeat extends CQNode.Module {
  onMessage(data, resp) {
    return resp.reply(`收到消息: ${data.msg}`);
  }
}

CQNode.createRobot({
  modules: [new Repeat()],
});
```
运行`node index`启动CQNode，然后发消息给机器人吧

> 预计行为：  
> __[群聊]__  
> __user__: aaa  
> __robot__: `@user` 收到消息: aaa  
> 
> __[私聊]__  
> __user__: aaa  
> __robot__: 收到消息: aaa  

[下一步 消息处理](./messagehandling)
