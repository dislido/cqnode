import Robot from "../cqnode-robot";

export * from './common';

export function toUnderScoreCase(obj: object): object;
export function toUnderScoreCase(str: string): string;
export function toUnderScoreCase(t: any) {
  if (!t) return t;
  if (typeof t === 'string') return t.replace(/[(A-Z)]/g, it => `_${it.toLowerCase()}`);
  return Object.entries(t).reduce((prev: { [key: string]: any }, [key, value]) => {
    prev[key.replace(/[(A-Z)]/g, it => `_${it.toLowerCase()}`)] = value;
    return prev;
  }, {});
}

export function toCamelCase(obj: object): object;
export function toCamelCase(str: string): string;
export function toCamelCase(t: any) {
  if (!t || t instanceof Array) return t;
  if (typeof t === 'string') return t.replace(/_([a-z])/g, it => it[1].toUpperCase());
  return Object.entries(t).reduce((prev: { [key: string]: any }, [key, value]: [string, any]) => {
    if (typeof value === "object") value = toCamelCase(value);
    prev[key.replace(/_([a-z])/g, it => it[1].toUpperCase())] = value;
    return prev;
  }, {});
}

export function decodeHtml(str: string) {
  const s = str.replace(/&#[\d]{2,4};/g, hex => String.fromCharCode(parseInt(hex.slice(2, -1), 10)));
  return s.replace(/&amp;/g, '&');
}

export const nullCQNode = new Proxy({}, {
  get() {
    throw new Error('CQNode Error: 模块/插件未运行，不能使用CQNode');
  }
}) as Robot;
