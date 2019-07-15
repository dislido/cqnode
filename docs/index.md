> - **首页**
> > - [文档](/cqnode/docs)
> > - [教程](/cqnode/tutorial)

# 简介
CQNode是一个基于[酷Q](https://cqp.cc/)的Node.js的QQ机器人开发框架

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
  constructor(group) {
    this.group = group;
  }

  onRun() {
    this.minute = 0;
    this.timer = setInterval(() => {
      this.cqnode.api.sendGroupMsg(this.group, `模块已启动${++this.minute}分钟`);
    }, 60000);
  }

  onStop() {
    clearInterval(this.timer);
  }
}

CQNode.createRobot({
  modules: [new Timer(1145141919)],
});
```