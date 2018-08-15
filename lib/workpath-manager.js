const fs = require('fs');
const path = require('path');

class CQNodeWorkpathError extends Error {}

function createWorkPath(workpath) {
  fs.mkdirSync(workpath);
  fs.mkdirSync(path.resolve(workpath, 'module'));
  fs.mkdirSync(path.resolve(workpath, 'log'));
  fs.mkdirSync(path.resolve(workpath, 'group'));
}

module.exports = class WorkpathManager {
  constructor(workpath) {
    this.workpath = path.resolve(workpath);
    if (fs.existsSync(workpath)) {
      if (!fs.statSync(workpath).isDirectory) {
        throw new CQNodeWorkpathError(`${path.resolve(workpath)} is not a directory`);
      }
      return;
    }
    createWorkPath(workpath);
  }
};
