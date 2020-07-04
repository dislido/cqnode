# 简介
CQNode是一个基于[酷Q](https://cqp.cc/)与[CoolQ HTTP API 插件](https://cqhttp.cc/)的Node.js的QQ机器人开发框架  
- `HTTP API 4.11.0`
### [文档与教程](https://dislido.github.io/cqnode/)

### 安装  
`npm i @dislido/cqnode`

---

## 示例
### 复读
> 只需要几行代码即可实现一个简单的复读功能 

```javascript
// repeat.js
class Repeat extends CQNode.Module {
  onMessage(data, resp) {
    return resp.reply(`收到消息: ${data.msg}`);
  }
}

// index.js
const CQNode = require('@dislido/cqnode');
CQNode.createRobot({
  modules: [{ entry: './repeat' }],
});
```

### 定时器
> 简单的主动发送消息示例

```javascript
// timer.js
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

// index.js
const CQNode = require('@dislido/cqnode');
CQNode.createRobot({
  modules: [{ entry: './timer', config: { group: 114514 } }],
});
```