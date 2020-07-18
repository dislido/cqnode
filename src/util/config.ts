import Robot from "../cqnode-robot";
import { CQNodeConfig, ConfigObject } from "@/types/robot";

export const defaultConfig: CQNodeConfig = {
  admin: [],
  modules: [],
  plugins: [],
  atmeTrigger: [true],
  workpath: '.cqnode',
  connector: {
    LISTEN_PORT: 8080,
    API_PORT: 5700,
    TIMEOUT: 10000,
  },
};

/**
 * 检查配置项
 * @param {object} config 配置对象
 */
export function checkConfig(config: ConfigObject) {
  const baseConfig: CQNodeConfig = Object.assign(JSON.parse(JSON.stringify(defaultConfig)), config);
  
  if (config.admin) {
    baseConfig.admin = Array.isArray(config.admin) ? config.admin : [config.admin];
    baseConfig.admin = baseConfig.admin.map(it => parseInt(it as any, 10));
  }

  if (config.modules) {
    if (!Array.isArray(baseConfig.modules)) throw new Error('config.modules类型错误');
    baseConfig.modules = config.modules;
  }

  if (config.plugins) {
    if (!Array.isArray(baseConfig.plugins)) throw new Error('config.plugins类型错误');
    baseConfig.plugins = config.plugins;
  }

  if (config.atmeTrigger) {
    baseConfig.atmeTrigger = Array.isArray(config.atmeTrigger) ? config.atmeTrigger : [config.atmeTrigger];
    baseConfig.atmeTrigger = baseConfig.atmeTrigger.map(it => it === true ? it : `${it}`);
  }

  if (config.workpath) {
    if (typeof config.workpath !== 'string') throw new Error('config.workpath类型错误');
    baseConfig.workpath = config.workpath;
  }

  if (config.connector) {
    if (typeof config.connector !== 'object') throw new Error('config.connector 必须是对象');
    const baseConnector = baseConfig.connector;
    const { ACCESS_TOKEN, API_PORT, LISTEN_PORT, TIMEOUT } = config.connector;
    if (ACCESS_TOKEN) baseConnector.ACCESS_TOKEN = ACCESS_TOKEN;
    if (API_PORT) baseConnector.API_PORT = API_PORT;
    if (LISTEN_PORT) baseConnector.LISTEN_PORT = LISTEN_PORT;
    if (TIMEOUT) baseConnector.TIMEOUT = TIMEOUT;
  }

  return baseConfig;
}

export async function loadConfig(this: Robot, defaultConfig: ConfigObject | string) {
  const configFile = await this.workpath.readJson('config.json', null);
  JSON.stringify(defaultConfig, undefined, 2)
  const config = checkConfig(configFile || defaultConfig);
  await this.workpath.writeJson('config.json', defaultConfig);
  return config;
}
