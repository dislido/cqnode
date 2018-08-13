const CQNode = require('./lib/cqnode');
const Module = require('./lib/robot-module');
const Plugin = require('./lib/robot-plugin');

module.exports = {
  createRobot(config) {
    return new CQNode(config);
  },
  Module,
  Plugin,
};
