# CQNodeRobotAPI
CQNode提供的操作cqnode相关功能的api，在Module中可通过`this.cqnode.api.robot`访问  

> api列表
>> [`getConfig`](#getConfig) 获取全局config或群config
>> [`setConfig`](#setConfig) 保存全局config或群config

## getConfig
> `getConfig(groupId?: number): Promise<CQNodeConfig>`  
> 获取全局config或群config  
> - `groupId` 群号码，不传则获取全局config

## setConfig
> `setConfig(groupId?: number): Promise<CQNodeConfig>`  
> 保存全局config或群config  
> - `groupId` 群号码，不传则保存全局config
