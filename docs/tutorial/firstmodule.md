CQNode通过加载模块来处理各种事件

# 第一个模块
这是主页上的第一个示例，一个简单的复读机  
`/index.js`
```javascript
const { CQEventType, createRobot } = require('@dislido/cqnode');

// 此注释用于提供代码提示 通常更建议使用typescript来标注类型
/**
 * @type {import('@dislido/cqnode').FunctionModule}
 */
const Repeat = mod => {
  // 定义模块的meta信息，packageName是必填项，声明模块名称
  mod.setMeta({
    packageName: 'repeat',
  });
  // 监听事件，此次监听了消息类型事件
  mod.on(CQEventType.message, async ctx => {
    // 进行回复操作
    ctx.reply(`收到消息: ${ctx.textMessage}`);
    // 返回true(或对应boolean值为true的任意值)，代表此模块处理了此事件，在有多个模块的情况下，被处理的事件不会流转到后续模块
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
