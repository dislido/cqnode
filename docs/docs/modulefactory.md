# ModuleFactory
使用class编写模块时，需要为`data`,`resp`等参数添加类型声明才能提供代码提示 
```javascript
// 使用class编写模块
class MyModule extends CQNode.Module {
  /**
   * 你需要添加这样的类型声明才能给data, resp提供代码提示
   * 使用typescript可以写的简单一些，但仍然有些麻烦
   * @param {CQEvent.Message} data 
   * @param {CQResponse.Message} resp 
   */
  onMessage(data, resp) { }
}
``` 
而使用`ModuleFactory`来创建模块则可以省去这个步骤，`data`和`resp`会自动获得类型检查和代码提示  
```javascript
const MyModule = new CQNode.Module.Factory()
  .onMessage((data, resp) => {
    return resp.reply(`received: ${data.msg}`);
  })
  .createModule();
```

## 消息处理
`ModuleFactory`实现了class写法中所有的消息处理函数，可以链式调用
```javascript
const mf = new CQNode.Module.Factory();

mf.onMessage((data, resp) => {
  return false;
}).onGroupMessage((data, resp) => {
  return resp.reply('hello');
});
```

> 注意：在`ModuleFactory`中，如果你想使用`this`，就不能使用箭头函数

## 创建模块
使用`mf.createConstructor`来创建模块类，可以在此处设置模块的`inf`和初始化函数
```javascript
const MyModule = mf.createConstructor({
  packageName: '@myname/cqnode-module-mymodule',
  name: '我的模块',
  help: '模块帮助信息',
  description: '模块描述',
}, function(log) {
  console.log(log); // hello module
});

CQNode.createRobot({
  modules: [new MyModule('hello module')],
})
```
> 注意：`createConstructor`的第二个参数不能是箭头函数

## 检查重复声明
`ModuleFactory`默认会在声明重复的消息处理函数报错，可以设置`noDuplicate`来关闭它，此时后声明的消息处理函数会覆盖先声明的
```javascript
const mf = new CQNode.Module.Factory();

mf.onMessage((data, resp) => {
  return false;
}).onMessage((data, resp) => {
  return resp.reply('hello');
});
// ModuleFactoryError: duplicate onMessage

const mf2 = new CQNode.Module.Factory({ noDuplicate: false });
mf.onMessage((data, resp) => {
  return false;
}).onMessage((data, resp) => {
  return resp.reply('hello');
});
// onMessage: 回复 hello
```