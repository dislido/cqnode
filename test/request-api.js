/**
   * 进行API请求
   * @param {string} path 请求地址
   * @param {Object} body 请求内容
   * @returns {Promise<JSON>} 响应数据
   */
module.exports = function requestAPI(path, body) {
    const content = body ? JSON.stringify(body) : '';
    /**
     * @todo Promise保持在pending状态不resolve，需要检查
     */
    let data = '';
    return http.request({
      host: '127.0.0.1',
      port: 5700,
      path,
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Content-length': content.length,
      },
    }, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        console.log('received:', chunk);
        data += chunk;
      }).on('end', () => {
        console.log('end: ', data && JSON.parse(data));
      });
    }).on('error', (e) => console.log('error', e)).end(content);
  }