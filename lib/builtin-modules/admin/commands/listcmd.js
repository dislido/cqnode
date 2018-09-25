module.exports = {
  exec: (_, { msgData, resp }) => {
    const userAuth = this.getUserAuth(msgData.fromQQ);
    resp.send(`~$listcmd:\n你的权限是${userAuth},可以使用的指令:\n${
      Object.keys(this.commands)
        .filter(cmdName => this.commands[cmdName].auth <= userAuth)
        .join('\n')
    }`);
  },
  auth: 0,
  description: '查看可用指令: ~$listcmd',
};
