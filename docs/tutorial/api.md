# API
前面的例子中，我们使用`ctx.reply`来返回消息，但`resp`只适用于回复消息的情况，如果需要在未接收到消息时想要主动发送消息的情况下，就无法使用这种方式了
在这种情况下，就需要靠使用API来发送消息

```javascript
const MyModule = mod => {
  mod.setMeta({
    packageName: 'myModule',
  });
  mod.api.sendGroupMsg(1919810, `本模块已启动`);
};
```
api使用方式与OICQ Client相同，参考https://github.com/takayama-lily/oicq#class-client

[下一步 插件](./plugin)
