/**
 * class ModuleSvc:
 * [svcName: [config.prompt.svc][svcName][...params]]: {
 *  apply: (...params) => string
 *  ownerModule: CQNodeModule
 * 
 * }
 */

module.exports = class ModuleSvcManager {
  constructor() {
    this.svcMap = Object.create(null);
  }

  requestSvc(svcName, ...params) {
    if (!this.svcMap[svcName]) return false;
    try {
      this.svcMap[svcName].apply(...params);
      return true;
    } catch (e) {
      console.error(`[error]ModuleSvcError: ${svcName} `, e)
    }
    return false;
  }

  registerSvc(ownerModule, svc) {

  }

  removeSvc(svcName) {
    if (this.svcMap[svcName]) {
      Reflect.deleteProperty(this.svcMap, svcName);
    }
  }

  removeModule() {

  }
};
