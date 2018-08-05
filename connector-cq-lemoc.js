const WS = require('websocket').w3cwebsocket;
// todo: const events = require('events')

const ws = new WS('ws://localhost:25303');

function sendMsg(act, to, msg) {
  const d = new Date();
  console.log(`[log]${d.toLocaleDateString()} ${d.toLocaleTimeString()} act:${act} to:${to} send:${msg}`);
  const $S = JSON.stringify;
  switch (act) {
    case 101: {
      try {
        ws.send($S({
          act: '101',
          groupid: to,
          msg,
        }));
      } catch (e) {
        console.error('err', e);
      }
      break;
    }
    case 106: {
      ws.send($S({
        act: '106',
        QQID: to,
        msg,
      }));
      break;
    }
    default:
      console.error('[need check code] unknown msg send type', act, new Error());
  }
}

// todo: eventEmitter
let robot = {
  onGroupMessage(data) {
    console.warn('no robot.onMessage function msg: ', data);
  },
  onGroupMemberIn(data) {
    console.log(`msg: ${data.beingOperateQQ} in by ${data.fromQQ} ${data.subType}`);
  },
  onGroupMemberOut(data) {
    console.log(`msg: ${data.beingOperateQQ} out by ${data.fromQQ} ${data.subType}`);
  },
  onPrimaryMessage(data) {
    console.warn('no robot.onPrimaryMessage function msg: ', data);
  },
  onGroupAdminChange(data) {
    const sub = data.subType === '1' ? 'canceled' : 'set';
    console.log(`msg: ${data.beingOperateQQ} ${sub} admin.(${data.fromGroup})`);
  },
};

const getRobot = () => robot;
const setRobot = (r) => { robot = r; };

ws.onmessage = (inp) => {
  const data = JSON.parse(inp.data);
  const actMap = {
    2: robot.onGroupMessage,
    21: robot.onPrimaryMessage,
    101: robot.onGroupAdminChange,
    102: robot.onGroupMemberOut,
    103: robot.onGroupMemberIn,
  };

  if (!actMap[data.act]) {
    console.error('[error] unhandled connector-cq-lemoc.onmessage: unknown msgtype:', data);
    return;
  }
  actMap[data.act](data);
};

module.exports = {
  getRobot,
  setRobot,
  sendMsg,
};
