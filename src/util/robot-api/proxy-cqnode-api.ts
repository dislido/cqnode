import Robot from '../../cqnode-robot';
import * as configFns from './config-fns';
import { CQAPI } from '@/types/cq-http';
import { CQNodeRobotAPI } from '@/types/cqnode-robot-api';

export function proxyCQNodeAPI(api: CQAPI, cqnode: Robot) {
  return new Proxy(api, {
    get(api, p, rec) {
      const apiProp = Reflect.get(api, p, rec);
      if (apiProp) return apiProp;

      if (p === 'robot') {
        return new Proxy({}, {
          get(rob, robp) {
            if (robp === 'cqnode') return cqnode;
            if (Reflect.has(configFns, robp)) return Reflect.get(configFns, robp);
          }
        });
      }
    }
  }) as CQAPI & { robot: CQNodeRobotAPI };
}