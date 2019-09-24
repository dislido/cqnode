# util
`CQNode.util`内包含了一些辅助开发的工具函数

## util.eventType
包含了判断事件类型的函数
- `isMessage(event)` 是否是消息事件
- `isNotice(event)` 是否是通知事件
- `isRequest(event)` 是否是请求事件
- `isMetaEvent(event)` 是否是元事件
- `isPrivateMessage(event)` 是否是私聊消息事件
- `isDiscussMessage(event)` 是否是讨论组消息事件
- `isGroupMessage(event)` 是否是群消息事件
- `isGroupUploadNotice(event)` 是否是群文件上传通知事件
- `isGroupAdminNotice(event)` 是否是群管理员变动通知事件
- `isGroupDecreaseNotice(event)` 是否是群成员减少通知事件
- `isGroupIncreaseNotice(event)` 是否是群成员增加通知事件
- `isFriendAddNotice(event)` 是否是好友添加通知事件
- `isFriendRequest(event)` 是否是加好友请求事件
- `isGroupRequest(event)` 是否是加群请求事件
- `isLifecycleMeta(event)` 是否是生命周期元事件
- `isHeartbeatMeta(event)` 是否是心跳元事件
- `assertEventName(event)` 获取具体的事件名

```javascript
onEvent(data) {
  if (CQNode.util.isMessage(data)) {
    // 此处的data会被智能判断为Message类型并提供相应的代码提示
    console.log(data.msg);
    // 应该会是'PrivateMessage' | 'DiscussMessage' | 'GroupMessage' 中的其中一个
    console.log(CQNode.util.assertEventName(data));
  }
}
```

## util.CQCode
包含了CQCode相关的工具，参考[CQ码](https://d.cqp.me/Pro/CQ%E7%A0%81)
```javascript
// 按基本格式构建CQCode字符串
const at = CQNode.util.CQCode('at', { qq: 114514 });
console.log(at); // '[CQ:at,qq=114514]'

// 预定义的CQCode生成函数
const at = CQNode.util.CQCode.at(114514);
console.log(at); // '[CQ:at,qq=114514]'
```
- `CQCode.face`
- `CQCode.emoji`
- `CQCode.bface`
- `CQCode.sface`
- `CQCode.image`
- `CQCode.record`
- `CQCode.at`
- `CQCode.rps`
- `CQCode.dice`
- `CQCode.shake`
- `CQCode.anonymous`
- `CQCode.music`
- `CQCode.share`

__CQCode返回的是`CQCodeString`，继承于`String`,添加了一个额外方法`parse()`将字符串转换为对象格式__
```javascript
const at = CQNode.util.CQCode.at(114514).parse()
console.log(at); // { type: 'at', data: { qq: '114514' } }
```