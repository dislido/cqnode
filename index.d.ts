export = CQNode;
export as namespace CQNode;
interface RobotConfig {
  admin?: string[];
  modules: CQNode.Module[];
  plugins?: CQNode.Plugin[];
}
declare class CQNodeRobot {

}

declare namespace CQNode {
  interface CQHttpMessage {
    msg: string;
  }
  interface GroupMessage extends CQHttpMessage {
    msg: string;
  }
  class Module {
    onMessage(CQHttpMessage: CQHttpMessage, {}): void;
    onGroupMessage(CQHttpMessage: CQHttpMessage, {}): void;
    abstract foo(a: number, b: number): string;
  }
  class Plugin {

  }
  function createRobot(config: RobotConfig): CQNodeRobot;
}
