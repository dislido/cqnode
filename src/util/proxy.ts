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

function resolveApiHook(data: {
  ctx?: CQNodeEventContext;
  mod: FunctionModuleInstance;
  target: any;
  prop: string;
  checkAsync: readonly string[] | ((prop: string) => boolean);
  cqnode: CQNodeRobot;
  nameSpace?: string;
  proxyResult?: (data: any, ctx: CQNodeEventContext | undefined, mod: FunctionModuleInstance, cqnode: CQNodeRobot) => any;
}) {
  const {
    ctx, mod, target, prop, checkAsync, nameSpace, cqnode, proxyResult,
  } = data;
  const checkAsyncFn = Array.isArray(checkAsync) ? (p: string) => checkAsync.includes(p) : checkAsync as (prop: string) => boolean;
  return (...params: any[]) => {
    if (!checkAsyncFn(prop)) {
      const hookData = cqnode.emitSyncHook(CQNodeHook.beforeModuleAPICall, {
        apiName: `${nameSpace ? `${nameSpace}.` : ''}${prop}`,
        params,
        ctx,
        mod,
        target,
        prop,
      });
      if (!hookData) return null;
      const result = (hookData.target as any)[hookData.prop](...hookData.params);
      return proxyResult ? proxyResult(result, ctx, mod, cqnode) : result;
    }

    return cqnode.emitHook(CQNodeHook.beforeModuleAPICall, {
      apiName: `user.${prop}`,
      params,
      ctx,
      mod,
      target,
      prop,
    }).then(hookData => {
      if (!hookData) return null;
      const result = (hookData.target as any)[hookData.prop](...hookData.params);
      return proxyResult ? proxyResult(result, ctx, mod, cqnode) : result;
    });
  };
}

const contactableAsyncApiNames = [
  'uploadImages',
  'uploadVideo',
  'uploadPtt',
  'makeForwardMsg',
  'getForwardMsg',
  'getVideoUrl',
] as const;

const userAsyncApiNames = [
  ...contactableAsyncApiNames,
  'getAddFriendSetting',
  'getSimpleInfo',
  'getChatHistory',
  'markRead',
  'sendMsg',
  'addFriendBack',
  'setFriendReq',
  'setGroupReq',
  'setGroupInvite',
  'getFileUrl',
] as const;

export function proxyUser(user: User, ctx: CQNodeEventContext | undefined, mod: FunctionModuleInstance, cqnode: CQNodeRobot): User {
  if (Reflect.get(user, proxyTag)) return user;
  return new Proxy(user, {
    get(target, prop: string | typeof proxyTag) {
      if (prop === proxyTag) return true;
      const val = Reflect.get(target, prop);
      if (typeof val !== 'function') return val;
      if (prop === 'asFriend') {
        return resolveApiHook({
          ctx,
          mod,
          target,
          prop,
          checkAsync: () => false,
          nameSpace: 'user',
          cqnode,
          proxyResult: proxyFriend,
        });
      }
      if (prop === 'asMember') {
        return resolveApiHook({
          ctx,
          mod,
          target,
          prop,
          checkAsync: () => false,
          nameSpace: 'user',
          cqnode,
          proxyResult: proxyMember,
        });
      }

      return resolveApiHook({
        ctx, mod, target, prop, checkAsync: userAsyncApiNames, nameSpace: 'user', cqnode,
      });
    },
  });
}

const friendAsyncApiNames = [
  ...userAsyncApiNames,
  'shareMusic',
  'setRemark',
  'setClass',
  'thumbUp',
  'poke',
  'delete',
] as const;

export function proxyFriend(friend: Friend, ctx: CQNodeEventContext | undefined, mod: FunctionModuleInstance, cqnode: CQNodeRobot): Friend {
  if (Reflect.get(friend, proxyTag)) return friend;
  return new Proxy(friend, {
    get(target, prop: string | typeof proxyTag) {
      if (prop === proxyTag) return true;
      const val = Reflect.get(target, prop);
      if (typeof val !== 'function') return val;
      if (prop === 'asFriend') {
        return resolveApiHook({
          ctx,
          mod,
          target,
          prop,
          checkAsync: () => false,
          nameSpace: 'friend',
          cqnode,
          proxyResult: proxyFriend,
        });
      }
      if (prop === 'asMember') {
        return resolveApiHook({
          ctx,
          mod,
          target,
          prop,
          checkAsync: () => false,
          nameSpace: 'friend',
          cqnode,
          proxyResult: proxyMember,
        });
      }

      return resolveApiHook({
        ctx, mod, target, prop, checkAsync: friendAsyncApiNames, nameSpace: 'friend', cqnode,
      });
    },
  });
}

const memberAsyncApiNames = [
  ...userAsyncApiNames,
  'renew',
  'setAdmin',
  'setTitle',
  'setCard',
  'kick',
  'mute',
  'poke',
  'addFriend',
] as const;

export function proxyMember(member: Member, ctx: CQNodeEventContext | undefined, mod: FunctionModuleInstance, cqnode: CQNodeRobot): Member {
  if (Reflect.get(member, proxyTag)) return member;
  return new Proxy(member, {
    get(target, prop: string | typeof proxyTag) {
      if (prop === proxyTag) return true;
      const val = Reflect.get(target, prop);
      if (typeof val !== 'function') return val;
      if (prop === 'asFriend') {
        return resolveApiHook({
          ctx,
          mod,
          target,
          prop,
          checkAsync: () => false,
          nameSpace: 'member',
          cqnode,
          proxyResult: proxyFriend,
        });
      }
      if (prop === 'asMember') {
        return resolveApiHook({
          ctx,
          mod,
          target,
          prop,
          checkAsync: () => false,
          nameSpace: 'member',
          cqnode,
          proxyResult: proxyMember,
        });
      }

      return resolveApiHook({
        ctx, mod, target, prop, checkAsync: memberAsyncApiNames, nameSpace: 'member', cqnode,
      });
    },
  });
}

const discussAsyncApiNames = [
  ...contactableAsyncApiNames,
  'sendMsg',
] as const;

export function proxyDiscuss(discuss: Discuss, ctx: CQNodeEventContext | undefined, mod: FunctionModuleInstance, cqnode: CQNodeRobot): Discuss {
  if (Reflect.get(discuss, proxyTag)) return discuss;
  return new Proxy(discuss, {
    get(target, prop: string | typeof proxyTag) {
      if (prop === proxyTag) return true;
      const val = Reflect.get(target, prop);
      if (typeof val !== 'function') return val;

      return resolveApiHook({
        ctx, mod, target, prop, checkAsync: discussAsyncApiNames, nameSpace: 'discuss', cqnode,
      });
    },
  });
}

const groupAsyncApiNames = [
  ...discussAsyncApiNames,
  'renew',
  'getMemberMap',
  'shareMusic',
  'sendMsg',
  'setName',
  'muteAll',
  'announce',
  'allowAnony',
  'setRemark',
  'muteAnony',
  'getAnonyInfo',
  'getAtAllRemainder',
  'markRead',
  'getChatHistory',
  'getFileUrl',
  'setAvatar',
  'invite',
  'quit',
  'setAdmin',
  'setTitle',
  'setCard',
  'kickMember',
  'muteMember',
  'pokeMember',
] as const;

export function proxyGroup(group: Group, ctx: CQNodeEventContext | undefined, mod: FunctionModuleInstance, cqnode: CQNodeRobot): Group {
  if (Reflect.get(group, proxyTag)) return group;
  return new Proxy(group, {
    get(target, prop: string | typeof proxyTag) {
      if (prop === proxyTag) return true;
      const val = Reflect.get(target, prop);
      if (typeof val !== 'function') return val;
      if (prop === 'pickMember') {
        return resolveApiHook({
          ctx,
          mod,
          target,
          prop,
          checkAsync: () => false,
          nameSpace: 'group',
          cqnode,
          proxyResult: proxyMember,
        });
      }

      return resolveApiHook({
        ctx, mod, target, prop, checkAsync: groupAsyncApiNames, nameSpace: 'group', cqnode,
      });
    },
  });
}

const OICQClientAsyncApiNames = [
  'login',
  'setOnlineStatus',
  'setNickname',
  'setGender',
  'setBirthday',
  'setDescription',
  'setSignature',
  'setAvatar',
  'getRoamingStamp',
  'deleteStamp',
  'getSystemMsg',
  'addClass',
  'deleteClass',
  'renameClass',
  'reloadFriendList',
  'reloadStrangerList',
  'reloadGroupList',
  'reloadBlackList',
  'getVideoUrl',
  'getForwardMsg',
  'makeForwardMsg',
  'getStrangerInfo',
  'getGroupInfo',
  'getGroupMemberList',
  'getGroupMemberInfo',
  'sendPrivateMsg',
  'sendGroupMsg',
  'sendDiscussMsg',
  'sendTempMsg',
  'deleteMsg',
  'reportReaded',
  'getMsg',
  'getChatHistory',
  'setGroupAnonymousBan',
  'setGroupAnonymous',
  'setGroupWholeBan',
  'setGroupName',
  'sendGroupNotice',
  'setGroupAdmin',
  'setGroupSpecialTitle',
  'setGroupCard',
  'setGroupKick',
  'setGroupBan',
  'setGroupLeave',
  'sendGroupPoke',
  'addFriend',
  'deleteFriend',
  'inviteFriend',
  'sendLike',
  'setPortrait',
  'setGroupPortrait',
  'setFriendAddRequest',
  'setGroupAddRequest',
  'sendOidb',
] as const;

export function proxyApi(api: OICQAPI, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
  if (Reflect.get(api, proxyTag)) return api;
  return new Proxy(api, {
    get(target, prop: string | typeof proxyTag) {
      if (prop === proxyTag) return true;
      const val = Reflect.get(target, prop);
      if (typeof val !== 'function') return val;
      if (prop === 'pickGroup') {
        return resolveApiHook({
          mod,
          target,
          prop,
          checkAsync: () => false,
          cqnode,
          proxyResult: proxyGroup,
        });
      }
      if (prop === 'pickFriend') {
        return resolveApiHook({
          mod,
          target,
          prop,
          checkAsync: () => false,
          cqnode,
          proxyResult: proxyFriend,
        });
      }
      if (prop === 'pickMember') {
        return resolveApiHook({
          mod,
          target,
          prop,
          checkAsync: () => false,
          cqnode,
          proxyResult: proxyMember,
        });
      }
      if (prop === 'pickUser') {
        return resolveApiHook({
          mod,
          target,
          prop,
          checkAsync: () => false,
          cqnode,
          proxyResult: proxyUser,
        });
      }
      if (prop === 'pickDiscuss') {
        return resolveApiHook({
          mod,
          target,
          prop,
          checkAsync: () => false,
          cqnode,
          proxyResult: proxyDiscuss,
        });
      }

      return resolveApiHook({
        mod, target, prop, checkAsync: OICQClientAsyncApiNames, cqnode,
      });
    },
  });
}

function proxyCtxEvent(ctx: CQNodeEventContext, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
  if (!ctx.event || Reflect.get(ctx.event, proxyTag)) return;
  ctx.event = ctx.event && new Proxy(ctx.event, {
    get(target, prop: string | typeof proxyTag) {
      if (prop === proxyTag) return true;
      const val = Reflect.get(target, prop);
      if (typeof val !== 'function') return val;
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

      return resolveApiHook({
        ctx,
        mod,
        target,
        prop,
        checkAsync: p => {
          if (ctx.eventType.startsWith('message')) {
            return p === 'reply';
          }
          if (ctx.eventType.startsWith('message.group')) {
            return p === 'reply' || p === 'recall';
          }
          if (ctx.eventType.startsWith('request')) {
            return p === 'approve';
          }
          return false;
        },
        nameSpace: ctx.eventType,
        cqnode,
      });
    },
  });
}

export function proxyCtx(ctx: CQNodeEventContext, mod: FunctionModuleInstance, cqnode: CQNodeRobot) {
  proxyCtxEvent(ctx, mod, cqnode);
  return ctx;
}
