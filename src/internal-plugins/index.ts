import { LoadModuleObject } from "@/types/robot";

export default [{
  entry: require.resolve('./group-config-check'),
  meta: {
    cqnodeInternal: {
      desc: 'CQNode内部插件: 收到群消息时检查是否已加载群配置',
    }
  },
}] as LoadModuleObject[];
