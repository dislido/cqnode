/**
 * 使用class编写模块时，需要为data,resp等参数添加类型声明才能提供代码提示  
 * 而使用ModuleFactory来创建模块则可以省去这个步骤  
 * 此外，ModuleFactory十分适合编写简短的小模块
 */

const CQNode = require('..');

const MyModule = new CQNode.ModuleFactory()
  .onMessage((data, resp) => {
    return resp.reply(`received: ${data.msg}`);
  })
  .onGroupMessage(function (data, resp) { // <- 使用this时不要使用箭头函数
    console.log('received groupMessage');
    return this.onMessage(data, resp);
  })
  .createModule(); // createModule返回模块实例，你可以在参数中为模块设置inf信息

CQNode.createRobot({
  modules: [MyModule],
});

/**
 * 预计行为：
 * [群聊]
 * user < aaa >
 * log: received groupMessage
 * robot < @user received: aaa >
 * 
 * [私聊]
 * user < aaa >
 * robot < received: aaa >
 */