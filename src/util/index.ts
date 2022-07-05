import { MessageElem } from 'oicq';

export { segment } from 'oicq';

export function getTextMessage(message: MessageElem[]) {
  return message.map(it => it.type === 'text' ? it.text : '').join('').trim();
}
