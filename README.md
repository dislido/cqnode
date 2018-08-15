# CQNode
酷Q的Node开发框架  
开发中，已经可以使用，但在正式版之前会有大量不兼容性修改

# todo
- log (或许由插件来完成)
- 更好的多群支持(WIP)
- 权限机制
- websocket断开连接时的处理
- test
- 文档(WIP)

# 使用
## 环境
需要安装[酷Q](https://cqp.cc/)和[lemoc插件](https://cqp.cc/t/29722)  
[Node.js](https://nodejs.org/en/) 10.8.0以上版本
## 启动
使用`CQNode.createRobot(config)`创建并启动机器人，`config`格式见下一节
```javascript
const CQNode = require('@dislido/cqnode');

CQNode.createRobot(config);
```
## 配置
```javascript
CQNode.createRobot({
  // 机器人的QQ号码, 必填
  qqid: '1234567890',
  // 管理员账号列表
  admin: ['1145141919'],
  // 在使用广播API时推送消息的群号码
  listenGroups: ['123456', '123123123'],
  // 加载的模块
  modules: [
    new Tuling({ apikey: 'aaaaa1231231231132112aaaaa123' }),
  ],
  // 加载的插件
  plugins: [
    new MsgTail('\n from CQNode'),
  ],
  // lemoc接口url
  lemocURL: 'ws://127.0.0.1:25303',
  // 机器人atme触发字符串 以该字符串开头的群消息会被认为发送给机器人，为null时表示使用@触发
  prompt: null,

  // [未完成] 机器人工作目录
  workpath: '.cqnode',
});
```

## todo notes
- `workpath:string='.cqnode'` 机器人运行所需的文件目录，同时启动多个机器人时要保证它们的目录各不相同

# 开发
## 编写模块
模块继承自CQNodeModule类
```javascript
const CQNode = require('@dislido/cqnode');

class MyModule extends CQNode.Module {
  constructor() {
    super();
    // inf提供模块的相关信息，必填项
    this.inf = {
      // 模块名
      name: '我的模块',
      // 模块描述信息
      description: '模块描述',
      // 模块帮助信息
      help: '模块帮助信息',
      // 用以保证唯一性的模块包名 请将所有的/替换成.
      package: '@dislido.mymodule',
    }
  }
  /**
   * 监听群消息
   * @param {object} 消息内容
   * @param {object} 包含了和响应回复相关的函数
   */
  onGroupMessage(msg, resp) {
    if (!msg.atme) return false;
    if (!msg.startsWith('我的模块：')) return false;
    resp.send('消息被接收');
    return true;
  }
}

module.exports = MyModule;
```

# API
