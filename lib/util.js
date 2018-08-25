module.exports = {
  /**
   * 检查配置项
   * @param {object} config 配置对象
   */
  checkConfig(config) {
    const cfg = {
      admin: [],
      listenGroups: [],
      modules: [],
      plugins: [],
      lemocURL: 'ws://127.0.0.1:25303',
      prompt: {},
      workpath: '.cqnode',
      ...config,
    };
    if (!config) throw new Error('config is required');
    if (!cfg.qqid) throw new Error('config.qqid is required');
    if (typeof cfg.workpath !== 'string' || !cfg.workpath) throw new TypeError('illegal config.workpath');
    if (typeof cfg.prompt !== 'object') throw new TypeError('illegal config.prompt');
    cfg.prompt = {
      group: true,
      svc: '~',
      admin: '~$',
      ...cfg.prompt,
    };
    if (cfg.prompt.group === true) cfg.prompt.group = `[CQ:at,qq=${cfg.qqid}]`;
    return cfg;
  },
};
