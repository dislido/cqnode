const CQNode = require('..');

class DemoModule extends CQNode.Module {
  async onGroupMessage() {
    console.log(this.bindingCQNode.inf.groupList)
  }
}


const robot = CQNode.createRobot({
  modules: [new DemoModule()],
  connector: {
    LISTEN_PORT: 8080,
    API_PORT: 5700,
  }
})

console.log(robot);
console.log('已启动');
