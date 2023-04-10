/**
 * 编写一个模块
 */
const CQNode = require('..');

/** @type {CQNode.FunctionModule} */
function MyModule(mod) {
  mod.setMeta({
    'packageName': 'demo-module',
  })
  mod.on(CQNode.CQEventType.message, console.log);
}

CQNode.createRobot({
  modules: [MyModule],
  connector: {
    account: 191107040,
    password: 'lido2263',
  },
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
