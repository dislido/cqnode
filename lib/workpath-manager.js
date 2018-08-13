const fs = require('fs');
const path = require('path');

class CQNodeWorkpathError extends Error {}

function createWorkPath(workpath) {
  fs.mkdirSync(workpath);
  Promise.all(fs.promises.mkdir(path.resolve(workpath, 'module')),
  fs.promises.mkdir(path.resolve(workpath, 'log')),
  fs.promises.mkdir(path.resolve(workpath, 'group')));
}

module.exports = class WorkpathManager {
  constructor(workpath) {
    this.workpath = workpath;
    if (fs.existsSync(workpath)) {
      if (!fs.statSync(workpath).isDirectory) {
        throw new CQNodeWorkpathError(`${path.resolve(workpath)} is not a directory`);
      }
      return;
    }
    createWorkPath(workpath);
  }
};
