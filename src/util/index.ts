import { MessageElem } from 'oicq';
import CQEventType, { CQEvent } from '../connector-oicq/event-type';

export { segment } from 'oicq';

export function getTextMessage(message: MessageElem[]) {
  return message.map(it => it.type === 'text' ? it.text : '').join('').trim();
}

/**
 * 判断事件是否是指定类型
 * @param event CQEvent
 * @param eventType CQEventType
 * @returns 是否是指定类型
 */
export function assertEventType<T extends CQEventType>(event: CQEvent, eventType: T): event is CQEvent<T> {
  return Reflect.get(event || { eventType: '' }, 'eventType').startsWith(eventType);
}
