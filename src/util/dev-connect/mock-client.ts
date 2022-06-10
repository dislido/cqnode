import { EventEmitter } from 'events';
import CQEventType, { CQEvent } from '../../connector-oicq/event-type';

export default class MockClient extends EventEmitter {
  send<T extends CQEventType>(eventType: T, data: CQEvent<T>) {
    this.emit(eventType, data);
  }

  init() {
    return Promise.resolve(true);
  }

  onEventReceived<T extends CQEventType>(eventName: T, event: CQEvent<T>) {
    this.emit('event', ({ eventName, event }));
  }
}
