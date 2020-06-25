/**
 * 编写一个模块
 */
const CQNode = require('..');

class MyModule extends CQNode.Module {
  constructor() {
    /** (可选)添加模块信息 */
    super({
      name: '我的模块',
      packageName: '@dislido/demo-mymodule',
      help: '模块帮助信息',
      description: '模块描述信息',
    });
  }
  onRun() {
    console.log(this.cqnode.inf.groupList)
  }
  /**
   * 添加这些类型声明可以获得代码提示，如果你使用TypeScript会更加方便
   * @param {CQNode.CQEvent.Event} data 
   * @param {CQNode.CQResponse.Message} resp 
   */
  onMessage(data, resp) {
    return resp.reply(`received: ${data.msg}`);
  }
  onEvent(data) {
    if (CQNode.util.eventType.isMessage(data)) {
      console.log(data.msg);
    }
  }
  /**
   * @param {CQNode.CQEvent.GroupMessage} data 
   * @param {CQNode.CQResponse.GroupMessage} resp 
   */
  onGroupMessage(data, resp) {
    console.log('received groupMessage');
    return this.onMessage(data, resp);
  }
}

CQNode.createRobot({
  modules: [new MyModule()],
  connector: {
    LISTEN_PORT: 8080
  }
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