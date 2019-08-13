import Robot from './cqnode-robot';

export default class CQNodePlugin {
  cqnode: Robot;

  onEventReceived(data: {}): false | object { return false; }
  onResponse(data: {}): false | object { return false; }
  onRequestAPI(data: {}): false | object { return false; }

  onRegister() {}
}
