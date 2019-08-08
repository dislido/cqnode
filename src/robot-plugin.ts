import Robot from './cqnode-robot';

export default class CQNodePlugin {
  onEventReceived(data: {}) {}
  onResponse(data: {}) {}
  onRequestAPI(data: {}) {}
  onRegister(cqnode: Robot) {}
}
