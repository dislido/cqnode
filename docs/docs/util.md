# util
`CQNode.util`内包含了一些辅助开发的工具函数
```javascript
import { util } from 'CQNode';
```

## `util.getTextMessage(message: MessageElem[]): string`
提取消息中的纯文本内容，不会像`rawMessage`一样将非文本内容解析为`[图片]`之类的内容，而是直接忽略它们

## `util.assertEventType<T extends CQEventType>(event: CQEvent, eventType: T): event is CQEvent<T>`
用于判断事件是否是指定类型

## `util.segment`
等同oicq的`segment`用于创建`MessageElem`