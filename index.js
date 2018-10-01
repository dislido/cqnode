const CQNodeRobot = require('./lib/cqnode-robot');
const Module = require('./lib/robot-module');
const Plugin = require('./lib/robot-plugin');

module.exports = {
  createRobot(config) {
    return new CQNodeRobot(config);
  },
  Module,
  Plugin,
};
