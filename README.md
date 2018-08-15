# cqnode-alpha
酷Q的Node开发框架  
未稳定

# todo
- 替换node-schedule依赖
- log
- 更好的多群支持
- 插件
- 权限机制
- websocket断开连接时的处理
- test
- 文档

# 配置
```javascript
const config = {
  // 机器人的QQ号码
  qqid: '1234567890',
  // 管理员账号列表
  admin: ['1145141919'],
  // 在使用广播API时推送消息的群号码
  listenGroups: ['123456'],
  // 加载的模块
  modules: [
    new Core(),
    new KcTwitter({ imageableGroup: '123456' }),
    new JSVM(),
    new ChatHistory({ imgPath: 'C:/Users/Administrator/Desktop/酷Q Air/data/image' }),
    new Admin(),
    new Notify(),
    new Repeat(),
    new TimeCall({
      use: [
        { group: '123456', use: 'kiyoshimo' },
        { group: '123456123', use: 'tokitsukaze' },
      ],
    }),
    new Tuling({ apikey: 'tcee43dc07834b269198f245ac2a19c1' }),
  ],
  // 加载的插件
  plugins: [
    // new MsgTail('\n from CQNode'),
    new ModuleCommand(),
  ],
  // lemoc接口url
  lemocURL: 'ws://127.0.0.1:25303',

  // [未实现]
  prompt: null,
  workpath: '.cqnode',
};
```

## todo notes
- `prompt:string?=null` 机器人atme触发字符串 以该字符串开头的__群消息__会被认为发送给机器人
  - `undefined|null|''` @该机器人时
- `workpath:string='.cqnode'` 机器人运行所需的文件目录，同时启动多个机器人时要保证它们的目录各不相同

# module
## inf
```javascript
this.inf = {
  // 模块名
  name: '我的模块',
  // 模块描述信息
  description: '模块描述',
  // 模块帮助信息
  help: '模块帮助信息',
  // 用以保证唯一性的模块包名
  package: '@dislido/mymodule',
}
```
