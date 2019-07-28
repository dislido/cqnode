# CQNode.createRobot
```javascript
CQNode.createRobot(ConfigObject);
```
创建并启动机器人  

- `ConfigObject`: [`ConfigObject`](#configobject) CQNode的配置对象

返回创建的机器人实例[`CQNode.Robot`](./robot)

## ConfigObject
CQNode配置对象，各属性默认值如下
```javascript
{
  /** 
   * 管理员
   * @type {number | number[]}
   */
  admin: undefined, // 不设置管理员
  // admin: 123456789, // 设置管理员qq号
  // admin: [123456789, 987654321], // 设置多个管理员

  /**
   * 加载的模块
   * @type {CQNode.Module[]}
   */
  modules: [],

  /**
   * 数据文件夹，一些数据缓存和配置会存放在此文件夹下
   * @type {string}
   */
  workpath: '.cqnode', // 在当前目录下的.cqnode文件夹中存放数据
  // workpath: 'D:/cqnode', // 在D:/cqnode文件夹中存放数据

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
