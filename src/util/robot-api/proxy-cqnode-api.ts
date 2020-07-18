import Robot from '../../cqnode-robot';
import { CQAPI } from '@/types/cq-http';
import { CQNodeRobotAPI } from '@/types/cqnode-robot-api';

export function proxyCQNodeAPI(this: Robot, api: CQAPI) {
  return new Proxy(api, {
    get: (api, p, rec) => {
      const apiProp = Reflect.get(api, p, rec);
      if (apiProp) return apiProp;

      if (p === 'robot') {
        return new Proxy({}, {
          get: (_, robp) => {
            if (robp === 'cqnode') return this;
            return undefined;
          }
        });
      }
    }
  }) as CQAPI & { robot: CQNodeRobotAPI };
}