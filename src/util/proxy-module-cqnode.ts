import Robot from '../cqnode-robot';
import CQNodeModule from '../robot-module';
import CQAPI from '../connector-cqhttp/api';

export function proxyModuleCQNode(this: Robot, mod: CQNodeModule) {
  const apiProxy = new Proxy(this.api, {
    get: (api, p) => {
      if (!Reflect.has(api, p)) return undefined;
      return new Proxy<Function>(Reflect.get(api, p), {
        apply: async (_, thisArg, argArray) => {
          const plgret = await this.pluginManager.emit('onRequestAPI', {
            get caller() { return mod; },
            apiName: p as keyof typeof CQAPI,
            params: argArray,
            function: undefined,
          });
          if (plgret === false) throw new Error(`CQNode: API请求被拦截: ${mod.inf.name} ${p as string}(${argArray.join(', ')})`);
          if (plgret.function) return plgret.function.apply(thisArg, plgret.params);
          return api[plgret.apiName].apply(thisArg, plgret.params);
        }
      });
    }
  });
  return new Proxy(this, {
    get(cqn, p) {
      if (p === 'api') return apiProxy;
      return Reflect.get(cqn, p);
    },
  });
}