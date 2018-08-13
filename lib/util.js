module.exports = {
  /**
   * 检查配置项
   * @param {object} config 配置对象
   */
  checkConfig(config) {
    if (!config) throw new Error('config is required');
    if (!config.qqid) throw new Error('config.qqid is required');
    if (typeof config.workpath !== 'string' || !config.workpath) throw new TypeError('illegal config.workpath');
  },
};
