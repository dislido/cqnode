import {
  Discuss, Friend, Group, Member, User,
} from 'oicq';
import { CQNodeEventContext } from '../module/event-context';
import CQNodeRobot from '../cqnode-robot';
import { CQNodeHook } from '../plugin/hook-processor';
import { FunctionModuleInstance } from '../module';
import { OICQAPI } from '../connector-oicq/proxy-oicq-api';
import CQEventType from '../connector-oicq/event-type';

const proxyTag = Symbol('cqnodeProxyTag');

/** @todo hook return null */

export function proxyUser(user: User, ctx: CQNodeEventContext | undefined, mod: FunctionModuleInstance, cqnode: CQNodeRobot): User {
  if (Reflect.get(user, proxyTag)) return user;
  return new Proxy(user, {
    get(target, p: string | typeof proxyTag) {
      if (p === proxyTag) return true;
      const val = Reflect.get(target, p);
      if (!val || typeof val !== 'function') return val;
      if (p === 'asFriend') {
        return (strict?: boolean) => proxyFriend(target.asFriend(strict), ctx, mod, cqnode);
      }
      if (p === 'asMember') {
        return (gid: number, strict?: boolean) => proxyMember(target.asMember(gid, strict), ctx, mod, cqnode);
      }

      return (...args: any[]) => {
        cqnode.emitHook(CQNodeHook.beforeModuleAPICall, {
          apiName: `user.${p}`,
          params: args,
          ctx,
          mod,
        });
        return (target as any)[p](...args);
      };
    },
  });
}

export function proxyFriend(friend: Friend, ctx: CQNodeEventContext | undefined, mod: FunctionModuleInstance, cqnode: CQNodeRobot): Friend {
  if (Reflect.get(friend, proxyTag)) return friend;
  return new Proxy(friend, {
    get(target, p: string | typeof proxyTag) {
      if (p === proxyTag) return true;
      const val = Reflect.get(target, p);
      if (!val || typeof val !== 'function') return val;
      if (p === 'asFriend') {
        return (strict?: boolean) => proxyFriend(target.asFriend(strict), ctx, mod, cqnode);
      }
      if (p === 'asMember') {
        return (gid: number, strict?: boolean) => proxyMember(target.asMember(gid, strict), ctx, mod, cqnode);
      }

      return (...args: any[]) => {
        cqnode.emitHook(CQNodeHook.beforeModuleAPICall, {
          apiName: `friend.${p}`,
          params: args,
          ctx,
          mod,
        });
        return (target as any)[p](...args);
      };
    },
  });
}

export function proxyMember(member: Member, ctx: CQNodeEventContext | undefined, mod: FunctionModuleInstance, cqnode: CQNodeRobot): Member {
  if (Reflect.get(member, proxyTag)) return member;
  return new Proxy(member, {
    get(target, p: string | typeof proxyTag) {
      if (p === proxyTag) return true;
      const val = Reflect.get(target, p);
      if (!val || typeof val !== 'function') return val;
      if (p === 'asFriend') {
        return (strict?: boolean) => proxyFriend(target.asFriend(strict), ctx, mod, cqnode);
      }
      if (p === 'asMember') {
        return (gid: number, strict?: boolean) => proxyMember(target.asMember(gid, strict), ctx, mod, cqnode);
      }
      return (...args: any[]) => {
        cqnode.emitHook(CQNodeHook.beforeModuleAPICall, {
          apiName: `member.${p}`,
          params: args,
          ctx,
          mod,
        });
        return (target as any)[p](...args);
      };
    },
  });
}

export function proxyDiscuss(discuss: Discuss, ctx: CQNodeEventContext | undefined, mod: FunctionModuleInstance, cqnode: CQNodeRobot): Discuss {
  if (Reflect.get(discuss, proxyTag)) return discuss;
  return new Proxy(discuss, {
    get(target, p: string | typeof proxyTag) {
      if (p === proxyTag) return true;
      const val = Reflect.get(target, p);
      if (!val || typeof val !== 'function') return val;
      return (...args: any[]) => {
        cqnode.emitHook(CQNodeHook.beforeModuleAPICall, {
          apiName: `discuss.${p}`,
          params: args,
          mod,
          ctx,
        });
        return (target as any)[p](...args);
      };
    },
  });
}

export function proxyGroup(group: Group, ctx: CQNodeEventContext | undefined, mod: FunctionModuleInstance, cqnode: CQNodeRobot): Group {
  if (Reflect.get(group, proxyTag)) return group;
  return new Proxy(group, {
    get(target, p: string | typeof proxyTag) {
      if (p === proxyTag) return true;
      const val = Reflect.get(target, p);
      if (!val || typeof val !== 'function') return val;
      if (p === 'pickMember') {
        return (uid: number, strict?: boolean) => proxyMember(target.pickMember(uid, strict), ctx, mod, cqnode);
      }
      return (...args: any[]) => {
        cqnode.emitHook(CQNodeHook.beforeModuleAPICall, {
          apiName: `group.${p}`,
          params: args,
          mod,
          ctx,
        });
        return (target as any)[p](...args);
      };
    },
  });
}

export function proxyApi(api: OICQAPI, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
  if (Reflect.get(api, proxyTag)) return api;
  return new Proxy(api, {
    get(target, p: string | typeof proxyTag) {
      if (p === proxyTag) return true;
      if (!Reflect.get(target, p)) return undefined;
      if (p === 'pickGroup') {
        return (gid: number, strict?: boolean) => proxyGroup(target.pickGroup(gid, strict), undefined, mod, cqnode);
      }
      if (p === 'pickFriend') {
        return (uid: number, strict?: boolean) => proxyFriend(target.pickFriend(uid, strict), undefined, mod, cqnode);
      }
      if (p === 'pickMember') {
        return (gid: number, uid: number, strict?: boolean) => proxyMember(target.pickMember(gid, uid, strict), undefined, mod, cqnode);
      }
      if (p === 'pickUser') {
        return (uid: number) => proxyUser(target.pickUser(uid), undefined, mod, cqnode);
      }
      if (p === 'pickDiscuss') {
        return (gid: number) => proxyDiscuss(target.pickDiscuss(gid), undefined, mod, cqnode);
      }
      return (...args: any[]) => {
        cqnode.emitHook(CQNodeHook.beforeModuleAPICall, {
          apiName: p,
          params: args,
          mod,
        });
        return (target as any)[p](...args);
      };
    },
  });
}

export function proxyCtxEvent(ctx: CQNodeEventContext, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
  if (!ctx.event || Reflect.get(ctx.event, proxyTag)) return;
  ctx.event = ctx.event && new Proxy(ctx.event, {
    get(target, p: string | typeof proxyTag) {
      if (p === proxyTag) return true;
      const val = Reflect.get(target, p);
      if (!val || typeof val !== 'function') return val;
      if ('group' in ctx.event) {
        ctx.event.group = proxyGroup(ctx.event.group, ctx, mod, cqnode);
      }
      if ('friend' in ctx.event) {
        ctx.event.friend = proxyFriend(ctx.event.friend, ctx, mod, cqnode);
      }
      if (ctx.eventType === CQEventType.messageGroup) {
        ctx.event.member = proxyMember(ctx.event.member, ctx, mod, cqnode);
      }
      if (ctx.eventType === CQEventType.messageDiscuss) {
        ctx.event.discuss = proxyDiscuss(ctx.event.discuss, ctx, mod, cqnode);
      }
      return (...args: any[]) => {
        cqnode.emitHook(CQNodeHook.beforeModuleAPICall, {
          apiName: `${ctx.eventType}.${p}`,
          params: args,
          ctx,
          mod,
        });
        return (target as any)[p](...args);
      };
    },
  }) as any;
}

export function proxyCtx(ctx: CQNodeEventContext, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
  proxyCtxEvent(ctx, mod, cqnode);
  return ctx;
}
