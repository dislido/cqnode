const WebSocket = require('ws');

module.exports = {
  connect(cqnode, lemocUrl = 'ws://127.0.0.1:25303') {
    const ws = new WebSocket(lemocUrl);
    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      const actMap = {
        2: 'groupMessage',
        21: 'privateMessage',
        101: 'groupAdminChange',
        102: 'groupMemberOut',
        103: 'groupMemberIn',
      };

      if (!actMap[msg.act]) {
        console.error('[error] unhandled connector-cq-lemoc.onmessage: unknown msgtype:', msg);
        return;
      }
      cqnode.emit(actMap[msg.act], msg);
    });
    return {
      send(data) {
        ws.send(JSON.stringify(data));
      },
      sendMsg(act, to, msg) {
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
      },
    };
  },
};
