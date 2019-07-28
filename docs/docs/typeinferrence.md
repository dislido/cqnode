# 代码提示与类型检查

CQNode使用[TypeScript](https://www.tslang.cn)编写，并且有完整的[声明文件](https://github.com/dislido/cqnode/blob/master/index.d.ts)，它提供了充足的代码提示和类型检查功能

## 在模块中启用代码提示

在js文件中使用class编写模块，需要借助jsdoc来提供代码提示
```javascript
class Repeat extends CQNode.Module {
  /**
   * @param {CQNode.CQEvent.Message} data 
   * @param {CQNode.CQResponse.Message} resp 
   */
  onMessage(data, resp) {
    return resp.reply(`收到消息: ${data.msg}`);
  }
}
```
然后你就能得到对`data`和`resp`的代码提示  
![resp代码提示](/cqnode/assets/img/typeinferrence-1.png)  
![data代码提示](/cqnode/assets/img/typeinferrence-2.png)

在ts文件中会简单一些
```typescript
class Repeat extends CQNode.Module {
  onMessage(data: CQNode.CQEvent.Message, resp: CQNode.CQResponse.Message) {
    return resp.reply(`收到消息: ${data.msg}`);
  }
}
```

## 使用ModuleFactory获得代码提示
[`ModuleFactory`](/cqnode/docs/modulefactory)不需要提供类型声明就能提供代码提示  

![ModuleFactory代码提示](/cqnode/assets/img/typeinferrence-3.png)
