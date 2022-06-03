import CQEventType, { CQEvent } from '../connector-oicq/event-type';

/** @todo 支持所有event类型，非message返回true */
export function checkAtme(event: CQEvent<CQEventType.message>, atmeTrigger: Array<string | true>, uin: number) {
  return atmeTrigger.some(p => {
    if (event.message_type === 'private') return true;
    if (p === true && event.message.some(it => it.type === 'at' && it.qq === uin)) {
      return true;
    }

    if (typeof p === 'string' && event.raw_message.trim().startsWith(p)) {
      /** @todo 放在ctx.msg中，从event.message中解析为CQCode形式 */
      // event.msg = event.raw_message.substring(p.length).trim();
      return true;
    }
    return false;
  });
}
