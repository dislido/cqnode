# CQNode.createRobot
```typescript
CQNode.createRobot(options: CQNodeOptions = {}, defaultConfig: ConfigObject = {});
```
创建并启动机器人  

- `config`: [`ConfigObject`](#configobject)|`string` CQNode的默认配置对象或workpath路径，默认配置对象仅在`{workpath}/config.json`不存在时生效，否则只读取`config.workpath`，configObject必须是一个合法的JSON对象，workpath见[`ConfigObject.workpath`](#config.workpath)

在初次启动时，会根据`workpath`创建CQNode工作目录，配置内容将使用workpath下的config.json

返回创建的机器人实例[`CQNode.Robot`](./robot)

## CQNodeOptions
cqnode启动参数
### options.workpath
```typescript
  workpath: '.cqnode', // 在当前目录下的.cqnode文件夹中存放数据
  // workpath: 'D:/cqnode', // 在D:/cqnode文件夹中存放数据
```

## ConfigObject
CQNode默认配置对象

各属性默认值如下
```javascript
{
  admin: undefined,
  modules: [],
  plugins: [],

  /**
   * CoolQ HTTP API 连接配置
   * 应与CoolQ HTTP API 插件的相关配置一致
   * 参考 [CoolQ HTTP API配置](https://cqhttp.cc/docs/#/Configuration)
   */
  connector: {
    /**
     * 事件监听接口
     * 对应HTTP API配置的post_url项
     */
    LISTEN_PORT: 8080,
    /**
     * HTTP API接口  
     * 对应HTTP API配置的port项
     */
    API_PORT: 5700,
    /** 事件处理超时时长（毫秒） */
    TIMEOUT: 10000,
    /** access_token */
    ACCESS_TOKEN: undefined,
  },

  /**
   * atme判断字符串  
   * 以该字符串开头的信息会被认为at了本机器人  
   * 默认使用QQ的at  
   * 空字符串表示将任何消息当作at了本机器人
   * @type {string | true | Array<string | true>}
   */
  atmeTrigger: true, // 将@本账号开头的消息作为atme
  // atmeTrigger: '-', // 将-开头的消息作为atme消息
  // atmeTrigger: [true, '-', '.'], // 设置多个atme判断规则
}
```

### config.admin
___此配置项将在未来版本被权限系统替代___

管理员，cqnode目前不会读取此配置，只用于模块判断管理员权限

可以设置为`number | number[]`
```typescript
{
  admin: undefined, // 不设置管理员
  // admin: 123456789, // 设置管理员qq号
  // admin: [123456789, 987654321], // 设置多个管理员
}
```

### config.modules
加载模块，是一个模块配置数组，数组属性会决定消息传递给模块的顺序

允许的配置方式如下
```typescript
{
  modules: [
    {
      /** 加载模块路径名或npm包名 */
      entry: './src/modules/my-module',
      /** 模块构造函数参数 */
      constructorParams: [123, 456], 
      /** 模块默认配置对象 */
      config: { aaa: 123 }, 
      /** 模块meta信息 */
      meta: {
        /** 是否启用模块 */
        enable: true,
      },
    },
  ],
}
```

### config.plugins
加载插件，格式同模块配置

```typescript
{
  plugins: [
    {
      /** 加载插件路径名或npm包名 */
      entry: './src/plugins/my-plugin',
      /** 插件构造函数参数 */
      constructorParams: [123, 456], 
      /** 插件默认配置对象 */
      config: { aaa: 123 }, 
      /** 插件meta信息 */
      meta: { alias: 'myModule' },
    },
  ],
}
```

### config.connector
```typescript
{
  /**
   * CoolQ HTTP API 连接配置
   * 应与CoolQ HTTP API 插件的相关配置一致
   * 参考 [CoolQ HTTP API配置](https://cqhttp.cc/docs/#/Configuration)
   */
  connector: {
    /**
     * 事件监听接口
     * 对应HTTP API配置的post_url项
     */
    LISTEN_PORT: 8080,
    /**
     * HTTP API接口  
     * 对应HTTP API配置的port项
     */
    API_PORT: 5700,
    /** 事件处理超时时长（毫秒） */
    TIMEOUT: 10000,
    /** access_token */
    ACCESS_TOKEN: undefined,
  },
}
```

### config.connector
```typescript
{
  /**
   * atme判断字符串  
   * 以该字符串开头的信息会被认为at了本机器人  
   * 默认使用QQ的at  
   * 空字符串表示将任何消息当作at了本机器人
   * @type {string | true | Array<string | true>}
   */
  atmeTrigger: true, // 将@本账号开头的消息作为atme
  // atmeTrigger: '-', // 将-开头的消息作为atme消息
  // atmeTrigger: [true, '-', '.'], // 设置多个atme判断规则
}
```

## groupConfig
CQNode支持群维度的配置能力，配置文件保存在`{workpath}/group/{groupId}/config.json`，支持的配置如下

```typescript
{
  /**
   * modules配置，群配置不允许改变module顺序和构造函数参数，modules配置变为了以entry为key的对象  
   * 若entry指定的模块没有被加载，则此配置会被忽略（群配置不会加载模块）
   */
  modules: {
    [entry: string]: {
      config: {},
      meta: {
        enable: false,
      },
    }
  },

  /**
   * atme判断字符串  
   * 以该字符串开头的信息会被认为at了本机器人 
   * 默认使用QQ的at  
   * 空字符串表示将任何消息当作at了本机器人
   * @type {string | true | Array<string | true>}
   */
  atmeTrigger: true, // 将@本账号开头的消息作为atme
  // atmeTrigger: '-', // 将-开头的消息作为atme消息
  // atmeTrigger: [true, '-', '.'], // 设置多个atme判断规则
}
```
