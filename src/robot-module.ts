import { bindingCQNode, CQNodeModule as CQNodeModuleSymbols } from './symbols';
import * as fs from 'fs';

const { isRunning, onRun, onStop, svcList } = CQNodeModuleSymbols;
/**
 * @property {Object} symbols
 * @property {Symbol} symbols.bindingCQNode
 * @property {Symbol} symbols.svcList
 * @property {Symbol} symbols.isRunning
 */
export default class CQNodeModule {
  symbols = {
    bindingCQNode,
    svcList,
    isRunning,
  };
  constructor() {
    /*
      this.inf = {
        name: '',
        description: '',
        help: '',
        packageName: '',
        hidden: false,
      };
    */
    this[isRunning] = false;
    this[bindingCQNode] = null;
    this[svcList] = [];
  }
  onRun() {} // eslint-disable-line class-methods-use-this
  onStop() {} // eslint-disable-line class-methods-use-this
  /**
   * 接收消息事件
   * @abstract
   * @param {Object} msgData 消息对象
   * @param {string} msgData.msg 消息内容
   * @param {bool} msgData.atme 是否@
   * @param {Object} resp 回复
   * @param {function} resp.send 回复
   */
  onMessage(msgData, resp) { // eslint-disable-line class-methods-use-this
    return false;
  }
  onGroupMessage(msgData, resp) {
    return this.onMessage(msgData, resp);
  }
  onGroupNotice() { // eslint-disable-line class-methods-use-this
    return false;
  }
  onPrivateMessage(msgData, resp) {
    return this.onMessage(msgData, resp);
  }

  getFilepath() {
    if (!this[isRunning]) throw new Error('在模块启动后才能使用(包括onRun和onStop)');
    const filepath = this[bindingCQNode].workpathManager.getWorkPath(`module/${this.inf.packageName}`);
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath);
    }
    return filepath;
  }

  [onRun](CQNode) {
    this[bindingCQNode] = CQNode;
    this[isRunning] = true;
    this.onRun();
  }
  [onStop]() {
    this.onStop();
    this[bindingCQNode] = null;
    this[isRunning] = false;
  }
}
