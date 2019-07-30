# API
前面的例子中，我们使用`resp.reply`来返回消息，但`resp`只适用于可以立刻回复消息的情况，如果存在异步或需要等待一段时间才能回复的场景，或者在需要在未接收到消息时想要主动发送消息的情况下，就无法使用resp了

```javascript
class MyModule extends CQNode.Module {
  onGroupMessage(data, resp) {
    setTimeout(() =>  resp.reply(`收到消息10秒: ${data.msg}`), 10000); // 回复无效，resp在return后就失效了
    return true;
  }
}
```

在这种情况下，就需要靠使用API来发送消息
```javascript
class MyModule extends CQNode.Module {
  onGroupMessage(data, resp) {
    setTimeout(() => this.cqnode.api.sendGroupMsg(data.groupId, `收到消息10秒: ${data.msg}`), 10000); // 使用this.cqnode.api来主动发送请求
    return true;
  }
}
```
_api只有在模块启动状态下才能使用，也就是说你不能在构造函数中使用api，请将这样的代码放在`onRun`中执行_

# 定时器

```javascript
class Notify extends CQNode.Module {
  onGroupMessage(data, resp) {
    if (!atme) return false;

    const reg = /(\d+)秒后提醒 (.+)/.exec(msg);
    if (!reg) return false;

    const time = parseInt(reg[1]) * 1000;
    const str = regret[2];

    this.addNotify(time, () => this.cqnode.api.sendGroupMsg(`[CQ:at,qq=${userId}]设置的提醒：${str}`));
    return resp.reply(`提醒设置完毕`);
  }
};
```

> 预计行为：  
> __[群聊]__  
> 
> __user__: `@robot` 20秒后提醒 hello world  
> __robot__: `@user` 提醒设置完毕  
> _(等待20秒)_  
> __robot__: `@user` 设置的提醒：hello world

---

所有的API都返回一个`Promise`，数据结构如下  
```typescript
interface ResponseData<T> {
  /**
   * ok: 操作成功  
   * async: 请求已提交异步处理  
   * failed: 操作失败，详见retcode字段
   */
  status: 'ok' | 'async ' | 'failed',
  /**
   * 小于 0 时，为调用 酷Q 函数的返回码，详见https://d.cqp.me/Pro/%E5%BC%80%E5%8F%91/Error
   * 0	同时 status 为 ok，表示操作成功  
   * 1	同时 status 为 async，表示操作已进入异步执行，具体结果未知  
   * 100	参数缺失或参数无效，通常是因为没有传入必要参数，某些接口中也可能因为参数明显无效（比如传入的 QQ 号小于等于 0，此时无需调用 酷Q 函数即可确定失败），此项和以下的 status 均为 failed  
   * 102	酷Q 函数返回的数据无效，一般是因为传入参数有效但没有权限，比如试图获取没有加入的群组的成员列表  
   * 103	操作失败，一般是因为用户权限不足，或文件系统异常、不符合预期  
   * 104	由于 酷Q 提供的凭证（Cookie 和 CSRF Token）失效导致请求 QQ 相关接口失败，可尝试清除 酷Q 缓存来解决  
   * 201	工作线程池未正确初始化（无法执行异步任务）
   */
  retcode: number,
  /** 响应数据 */
  data: T,
}
```

参考[API文档](../docs/api)

[下一步 咕](#)
