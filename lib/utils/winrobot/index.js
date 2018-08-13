const rob = require('./winrobot.node');
const VK = require('./vk.json');

const isNumber = a => typeof a === 'number';

function mouseMove(x, y) {
  if (!isNumber(x) || !isNumber(y)) { throw new Error(`args error:x:${x}(${typeof x});${y}(${typeof y}); need(number,number)`); }
  rob.mouseMove(x, y);
}

function mouseClick(btn) {
  if (!isNumber(btn)) { throw new Error(`args error:btn:${btn}(${typeof btn}); need(number(1-3))`); }
  rob.mouseClick(btn);
}

function keyDown(key) {
  if (!isNumber(key)) { throw new Error(`args error:key:${key}(${typeof key}); need(number)`); }
  rob.keyDown(key);
}

function keyUp(key) {
  if (!isNumber(key)) { throw new Error(`args error:key:${key}(${typeof key}); need(number)`); }
  rob.keyUp(key);
}

function keyPress(key) {
  if (!isNumber(key)) { throw new Error(`args error:key:${key}(${typeof key}); need(number)`); }
  rob.keyPress(key);
}

const sleep = time => new Promise(resolve => setTimeout(resolve, time, true));

async function send() {
  keyDown(VK.CONTROL);
  keyPress(VK.V);
  await sleep(200);
  keyPress(VK.ENTER);
  keyUp(VK.CONTROL);
}

class QQClipObject {
  constructor() {
    this.data = ['<QQRichEditFormat>'];
  }
  appendImg(path) {
    this.data.push(`<EditElement type="1" filepath="${path}" shortcut=""></EditElement>`);
    return this;
  }
  appendText(str = '') {
    this.data.push(`<EditElement type="0"><![CDATA[${str}]]></EditElement>`);
    return this;
  }
  async end() {
    this.data.push('</QQRichEditFormat>');
    this.data.join('');
    rob.setQQClip(this.data);
    await send();
  }
}

module.exports = {
  mouseMove,
  mouseClick,
  keyDown,
  keyUp,
  keyPress,
  VK,
  QQClipObject,
};
/*
const r= require('./winrobot.js');
const sleep = (time)=>new Promise((res,rej)=>{setTimeout(()=>{res(true)},time)});
const pa = async () => {r.keyDown(r.VK.A);await sleep(30);r.keyUp(r.VK.A);}
const paa = async (time,delay) => {
  for(let i = 0;i<time ; i++){
    await sleep(delay);
    pa()
 }
}

*/
