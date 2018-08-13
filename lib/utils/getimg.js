// 虽然叫getimg，其实也能用来获取其他文件
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

async function getImg(url, fname, fpath = path.resolve(process.cwd(), 'img')) {
  const proto = (() => {
    if (url.startsWith('http:')) return http;
    if (url.startsWith('https:')) return https;
    return false;
  })();
  if (!proto) throw new Error(`protocol error: (http:|https:)${url}`);
  let filename = fname;
  if (!filename) {
    const extReg = /(\w+\.\w+)[^/]*$/.exec(url);
    filename = (extReg && extReg[1]) || `${Date.now()}.png`;
  }

  return new Promise((resolve, reject) => proto.get(url, (res) => {
    res.setEncoding('binary');
    let imgData = '';
    res.on('data', (chunk) => {
      imgData += chunk;
    }).on('end', (err) => {
      if (err) {
        reject(err);
        return;
      }
      fs.writeFileSync(path.resolve(fpath, filename), imgData, 'binary');
      resolve(filename);
    }).on('error', console.error);
  }).on('error', console.error));
}

module.exports = getImg;
