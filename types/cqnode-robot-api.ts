import { Robot, CQNodeConfig, GroupConfig } from "./robot";

export interface CQNodeRobotAPI {
  cqnode: Robot;
  /**
   * 获取全局config或群config
   */
  getConfig(this: CQNodeRobotAPI): Promise<CQNodeConfig>;
  /**
   * 获取全局config或群config
   * @param groupId 群号码
   */
  getConfig(this: CQNodeRobotAPI, groupId: number): Promise<GroupConfig>;
  /**
   * 保存全局config或群config
   * @param config config对象
   */
  setConfig(this: CQNodeRobotAPI, config: CQNodeConfig): Promise<void>;
  /**
   * 保存全局config或群config
   * @param config config对象
   * @param groupId 群号码
   */
  setConfig(this: CQNodeRobotAPI, config: GroupConfig, groupId: number): Promise<void>;
}
