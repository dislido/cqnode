/**
 * 在没有接收消息的情况下主动发送消息，相关API在`this.cqnode.api`中
 */

const CQNode = require('..');

class Timer extends CQNode.Module {
  constructor(group) {
    super({
      name: '定时发送消息',
      packageName: '@dislido/demo-timer',
      help: '',
      description: '模块启动后，每隔1分钟向指定群发送消息',
    });
    this.group = group;
  }
  /**
   * 在模块启动后，onRun会被调用
   */
  onRun() {
    this.minute = 0;
    this.timer = setInterval(() => {
      this.cqnode.api.sendGroupMsg(this.group, `模块已启动${++this.minute}分钟`);
    }, 60000);
  }
  
  /**
   * 在模块停止时，onStop会被调用
   */
  onStop() {
    clearInterval(this.timer);
  }
}

CQNode.createRobot({
  modules: [new Timer(1145141919)],
});

/**
 * 预计行为：
 * [群聊:1145141919]
 * [等待1分钟]
 * robot < 模块已启动1分钟 >
 * [等待1分钟]
 * robot < 模块已启动2分钟 >
 * [...]
 */