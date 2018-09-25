
const util = require('util');
const childProcess = require('child_process');

const exec = util.promisify(childProcess.exec);

module.exports = {
  async exec(cmd, { resp }) {
    try {
      const result = await exec(cmd);
      resp.send(`ok: ${JSON.stringify(result, null, 2)}`);
    } catch (e) {
      resp.send(`err: ${e}`);
    }
  },
  auth: 100,
  description: '执行command命令: ~$exec (命令行内容)',
};
