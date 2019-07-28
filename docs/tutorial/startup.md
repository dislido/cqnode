# 安装与启动
准备好CQNode所需要的环境

## 下载与安装
- > [Node.js](https://nodejs.org/)  
  > 推荐安装最新LTS版本，msi安装包一路下一步即可
- > [酷Q](https://cqp.cc/)  
  > air与pro版均可使用，但某些功能只能在pro版正常工作
- > [CoolQ HTTP API 插件](https://cqhttp.cc/)  
  > 下载4.x版本，并根据官网说明将插件放到酷Q指定目录下

此外，CQNode推荐使用[VSCode](https://code.visualstudio.com/)进行开发，这个编辑器可以为你提供充足的代码提示

## 准备工作
### 配置CoolQ HTTP API 插件  
参考[插件文档](https://cqhttp.cc/docs/#/Configuration)，在指定位置创建配置文件  
主要设置`port`和`post_url`两个字段，其他字段根据自己的需要设置  
本教程的示例配置文件：`\app\io.github.richardchien.coolqhttpapi\config.json`
```json
{
  "general": {
    "port": 5700,
    "post_url": "http://127.0.0.1:8080",
    "post_timeout": 1000,
    "disable_coolq_log": false,
    "enable_heartbeat": false,
    "heartbeat_interval": 15000,
    "show_log_console": false
  }
}
```
即`port`端口`5700`，`post_url`为本机`8080`端口，这是CQNode的默认端口，如果你想更改它，可以参考[createRobot](../docs/robot)中的`connector`项进行配置

配置完毕后启动酷Q并启动HTTP API插件  

### 创建Node.js项目
新建一个文件夹来创建你的机器人，本教程默认为`/cqnode-tutorial/`    
在该文件夹下运行`npm init`生成`/package.json`文件  
运行`npm i @dislido/cqnode`安装CQNode，安装完成后会看到`/node_modules/`文件夹  
创建`/index.js`文件
```javascript
const CQNode = require('@dislido/CQNode');

CQNode.createRobot();


// 如果你修改了默认的端口，那么你的代码应该是这样
// 假设port = 6000, post_url = 8999
/* 
CQNode.createRobot({
  connector: {
    LISTEN_PORT: 8999,
    API_PORT: 6000,
  },
});
*/
```

然后运行`node index`，你可能会看到如下信息
```
cqnode: 初始化中......
cqnode: 初始化完成 
```
说明配置成功，那么你可以进行下一步了

如果你看到了如下信息
```
cqnode: 初始化中......
cqnode warn: 未能获取到运行信息，可能因为酷Q或HTTP API插件未启动，CQNode会在接收到HTTP API启动事件后开始初始化
```
说明你的配置可能出了一些问题，请检查酷Q和HTTP API插件是否正常启动，HTTP API插件配置是否正确

_你不需要一次次重启CQNode来测试配置是否正确，当你以正确的配置启动酷Q后，CQNode会自动继续未完成的初始化工作_

[下一步 第一个模块](./firstmodule)