module.exports = {
  exec: (js) => {
    eval(js); // eslint-disable-line no-eval
  },
  auth: 100,
  description: '运行js代码: ~$eval (代码内容)',
};
