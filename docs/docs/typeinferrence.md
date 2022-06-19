# 代码提示与类型检查

CQNode使用[TypeScript](https://www.typescriptlang.org/)编写，它提供了充足的代码提示和类型检查功能

## 在模块中启用代码提示

在js文件中使用编写模块，需要借助jsdoc来提供代码提示
```javascript
const { CQEventType } = require('@dislido/cqnode');

/**
 * @type {import('@dislido/cqnode').FunctionModule}
 */
const Repeat = mod => {
  mod.setMeta({
    packageName: 'repeat',
  });
  mod.on(CQEventType.message, async ctx => {
    ctx.reply(`收到消息: ${ctx.textMessage}`);
    return true;
  });
};

```
然后你就能得到对`data`和`resp`的代码提示  

在ts文件中会简单一些
```typescript
import { FunctionModule, CQEventType } from '@dislido/cqnode';

const Repeat: FunctionModule = mod => {
  mod.setMeta({
    packageName: 'repeat',
  });
  mod.on(CQEventType.message, async ctx => {
    ctx.reply(`收到消息: ${ctx.textMessage}`);
    return true;
  });
};
```
