# 安装与启动
准备好CQNode所需要的环境

## 下载与安装
- > [Node.js](https://nodejs.org/)  >= 14.0.0

## 准备工作
### 创建Node.js项目
新建一个文件夹来创建你的机器人，本教程默认为`/cqnode-tutorial/`    
在该文件夹下运行`npm init`生成`/package.json`文件  
运行`npm i @dislido/cqnode`安装CQNode  
创建`/index.js`文件
```javascript
const CQNode = require('@dislido/CQNode');

CQNode.createRobot({
  connector: {
    account: 114514, // qq号
    password: '1919810', // 密码，可以不填，此时会使用扫码登录
  },
});
```

然后运行`node index`，你会看到如下信息
```
cqnode: 初始化中......
设备锁验证(验证完成后按回车登录)：http://xxx...
```
或其他验证方式，根据提示完成验证，登录完成后，会显示
```
cqnode: 初始化完成
```
说明启动成功，那么你可以进行下一步了

[下一步 第一个模块](./firstmodule)