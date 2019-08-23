import Robot from "./cqnode-robot";

export { decodeHtml } from "./util";
/**
 * @todo
 * @param msg 文本信息
 */
export function formatCQMessage(msg: string) {

}
/**
 [CQ:image,url=123123,file=123123]
{
  "type": "image",
  "data": { "url": "123123", "file": "123123" }
},
 */
export const nullCQNode = new Proxy({}, {
  get() {
    throw new Error('CQNode Error: 模块/插件未运行，不能使用CQNode');
  }
}) as Robot;
