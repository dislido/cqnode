# 简介
CQNode是一个基于[酷Q](https://cqp.cc/)的Node.js的QQ机器人开发框架
# 目录  
- [文档](/cqnode/docs)
- [教程](/cqnode/tutorial)

---
### 复读
> 只需要几行代码即可实现一个简单的复读功能

```javascript
class Repeat extends CQNode.Module {
  onMessage(data, resp) {
    return resp.reply(`收到消息: ${data.msg}`);
  }
}

CQNode.createRobot({
  modules: [new Repeat()],
});
```

### 定时器
> 简单的主动发送消息示例

```javascript
class Timer extends CQNode.Module {
  constructor(time, to, msg) {
    super();
    setTimeout()
  }
}

CQNode.createRobot({
  modules: [new Repeat()],
});
```