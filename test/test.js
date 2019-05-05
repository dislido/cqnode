const CQHttp = require('../dist/connector-cqhttp').default;
const events = require('events');

const ee = new events.EventEmitter();
console.log('cqhttp2');

const cqhttp = new CQHttp(ee);
console.log(cqhttp);
console.log('cqhttp ok');
