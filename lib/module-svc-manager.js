/**
 * class ModuleSvc:
 * [svcName]: [svcFunction]
 * [config.prompt.svc][svcName][...params]]
 */

module.exports = class ModuleSvcManager {
  constructor() {
    this.svcMap = Object.create(null);
  }

  requestSvc(svcName, ...params) {
    if (!this.svcMap[svcName]) return false;
    try {
      return this.svcMap[svcName](...params);
    } catch (e) {
      console.error(`[error]ModuleSvcError: ${svcName} `, e);
    }
    return false;
  }
  /**
   * 注册服务函数
   * @param {string} svcName 服务名
   * @param {function} svc 处理函数
   */
  registerSvc(svcName, svc) {
    if (this.svcMap[svcName]) return false;
    this.svcMap[svcName] = svc;
    return true;
  }

  /**
   * 删除服务函数
   * @param {function} svcRef 服务函数引用
   */
  removeSvc(svcRef) {
    const svc = Object.entries(this.svcMap).find(it => it[1] === svcRef);
    if (!svc) return true;
    return Reflect.deleteProperty(this.svcMap, svc[0]);
  }
};
