# 简介
CQNode是一个基于[OICQ](https://www.npmjs.com/package/oicq)的Node.js的QQ机器人开发框架

---

## 示例
### 复读
> 只需要几行代码即可实现一个简单的复读功能 

```javascript
const { CQEventType, createRobot } = require('@dislido/cqnode');

const Repeat = mod => {
  mod.setMeta({
    packageName: 'repeat',
  });
  mod.on(CQEventType.message, async ctx => {
    ctx.reply(`收到消息: ${ctx.textMessage}`);
    return true;
  });
};

createRobot({
  connector: {
    account: 114514,
    password: '1919810',
  },
  modules: [Repeat],
});
```

### 定时器
> 简单的主动发送消息示例，每分钟向指定群发送启动时间消息

```javascript
function Timer(mod, group) {
  let minute = 0;
  let timer = setInterval(() => {
    mod.api.sendGroupMsg(group, `模块已启动${++minute}分钟`);
  }, 60000);

  mod.onStop(() => {
    clearInterval(timer);
  })
}

CQNode.createRobot({
  connector: {
    account: 114514,
    password: '1919810',
  },
  modules: [Timer, 1145141919],
});
```