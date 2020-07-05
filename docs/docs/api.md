# CQNodeAPI
调用CQHTTP api，在Module中通过`this.cqnode.api`访问  
所有api都返回`Promise<CQHTTP.ResponseData<T>>`类型(或它的数组)的数据，结构如下
```typescript
interface ResponseData<T> {
  /**
   * ok: 操作成功  
   * async: 请求已提交异步处理  
   * failed: 操作失败，详见retcode字段
   */
  status: 'ok' | 'async ' | 'failed',
  /**
   * 小于 0 时，为调用 酷Q 函数的返回码，详见https://d.cqp.me/Pro/%E5%BC%80%E5%8F%91/Error
   * 0	同时 status 为 ok，表示操作成功  
   * 1	同时 status 为 async，表示操作已进入异步执行，具体结果未知  
   * 100	参数缺失或参数无效，通常是因为没有传入必要参数，某些接口中也可能因为参数明显无效（比如传入的 QQ 号小于等于 0，此时无需调用 酷Q 函数即可确定失败），此项和以下的 status 均为 failed  
   * 102	酷Q 函数返回的数据无效，一般是因为传入参数有效但没有权限，比如试图获取没有加入的群组的成员列表  
   * 103	操作失败，一般是因为用户权限不足，或文件系统异常、不符合预期  
   * 104	由于 酷Q 提供的凭证（Cookie 和 CSRF Token）失效导致请求 QQ 相关接口失败，可尝试清除 酷Q 缓存来解决  
   * 201	工作线程池未正确初始化（无法执行异步任务）
   */
  retcode: number,
  /** 响应数据 */
  data: T,
}
```

> api列表
>> [`sendPrivateMsg`](#sendprivatemsg) 发送私聊消息  
>> [`sendGroupMsg`](#sendgroupmsg) 发送群消息  
>> [`sendDiscussMsg`](#senddiscussmsg) 发送讨论组消息  
>> [`sendMsg`](#sendmsg) 发送消息  
>> [`deleteMsg`](#deletemsg) 撤回消息  
>> [`sendLike`](#sendlike) 发送好友赞  
>> [`setGroupKick`](#setgroupkick) 群组踢人  
>> [`setGroupBan`](#setgroupban) 群组单人禁言  
>> [`setGroupAnonymousBan`](#setgroupanonymousban) 群组匿名用户禁言  
>> [`setGroupWholeBan`](#setgroupwholeban) 群组全员禁言  
>> [`setGroupAdmin`](#setgroupadmin) 群组设置管理员  
>> [`setGroupAnonymous`](#setgroupanonymous) 群组匿名  
>> [`setGroupCard`](#setgroupcard) 设置群名片（群备注）  
>> [`setGroupLeave`](#setgroupleave) 退出群组  
>> [`setGroupSpecialTitle`](#setgroupspecialtitle) 设置群组专属头衔  
>> [`setDiscussLeave`](#setdiscussleave) 退出讨论组  
>> [`setFriendAddRequest`](#setfriendaddrequest) 处理加好友请求  
>> [`setGroupAddRequest`](#setgroupaddrequest) 处理加群请求／邀请  
>> [`getLoginInfo`](#getlogininfo) 获取登录号信息  
>> [`getStrangerInfo`](#getstrangerinfo) 获取陌生人信息  
>> [`getGroupList`](#getgrouplist) 获取群列表  
>> [`getGroupMemberInfo`](#getgroupmemberinfo) 获取群成员信息  
>> [`getGroupMemberList`](#getgroupmemberlist) 获取群成员列表  
>> [`getCookies`](#getcookies) 获取 cookies  
>> [`getCsrfToken`](#getcsrftoken) 获取 csrf token  
>> [`getCredentials`](#getcredentials) 获取qq相关接口凭证  
>> [`getRecord`](#getrecord) 获取语音  
>> [`getImage`](#getimage) 获取图片  
>> [`canSendImage`](#cansendimage) 检查是否可以发送图片  
>> [`canSendRecord`](#cansendrecord) 检查是否可以发送语音  
>> [`getStatus`](#getstatus) 获取插件运行状态  
>> [`getVersionInfo`](#getversioninfo) 获取酷q及http api插件的版本信息  
>> [`setRestartPlugin`](#setrestartplugin) 重启http api插件  
>> [`cleanDataDir`](#cleandatadir) 清理数据目录  
>> [`cleanPluginLog`](#cleanpluginlog) 清理插件日志  
>
> 返回数据 
>> [`CQHTTP.SendMsgResponseData`](#cqhttpsendmsgresponsedata)   
>> [`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)   
>> [`CQHTTP.GetLoginInfoResponseData`](#cqhttpgetlogininforesponsedata)   
>> [`CQHTTP.GetStrangerInfoResponseData`](#cqhttpgetstrangerinforesponsedata)   
>> [`CQHTTP.GetGroupListResponseData`](#cqhttpgetgrouplistresponsedata)   
>> [`CQHTTP.GetGroupMemberInfoResponseData`](#cqhttpgetgroupmemberinforesponsedata)   
>> [`CQHTTP.GetCookiesResponseData`](#cqhttpgetcookiesresponsedata)   
>> [`CQHTTP.GetCsrfTokenResponseData`](#cqhttpgetcsrftokenresponsedata)   
>> [`CQHTTP.GetFileResponseData`](#cqhttpgetfileresponsedata)   
>> [`CQHTTP.CanSendResponseData`](#cqhttpcansendresponsedata)   
>> [`CQHTTP.GetStatusResponseData`](#cqhttpgetstatusresponsedata)   
>> [`CQHTTP.GetVersionInfoResponseData`](#cqhttpgetversioninforesponsedata)   
>>

## sendPrivateMsg
> `sendPrivateMsg(userId: number, message: string, autoEscape?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.SendMsgResponseData`](#cqhttpsendmsgresponsedata)`>>`  
> 发送私聊消息    
> - `userId` 对方QQ号  
> - `message`  要发送的内容  
> - `autoEscape` 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效   

## sendGroupMsg
> `sendGroupMsg(groupId: number, message: string, autoEscape?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.SendMsgResponseData`](#cqhttpsendmsgresponsedata)`>>`  
> 发送群消息    
> - `groupId` 群号
> - `message` 要发送的内容
> - `autoEscape` 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效时有效  

## sendDiscussMsg
> `sendDiscussMsg(discussId: number, message: string, autoEscape?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.SendMsgResponseData`](#cqhttpsendmsgresponsedata)`>>`  
> 发送讨论组消息    
> - `discussId` 讨论组 ID（正常情况下看不到，需要从讨论组消息上报的数据中获得）
> - `message` 要发送的内容
> - `autoEscape` 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效

## sendMsg
> `sendMsg(messageType: 'private' | 'group' | 'discuss', id: number, message: string, autoEscape?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.SendMsgResponseData`](#cqhttpsendmsgresponsedata)`>>`  
> 发送消息  
> - `messageType` 消息类型 private:私聊/group:群组/discuss:讨论组
> - `id` 要发送到的私聊/群/讨论组号码
> - `message` 要发送的内容
> - `autoEscape` 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效

## deleteMsg
> `deleteMsg(messageId: number): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 撤回消息  
> - `messageId` 消息ID

## sendLike
> `sendLike(userId: number, times?: number): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`
> 发送好友赞
> - `userId` 对方QQ号
> - `times` 赞的次数，每个好友每天最多10次

## setGroupKick
> `setGroupKick(groupId: number, userId: number, rejectAddRequest?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 群组踢人
> - `group_id` 群号
> - `user_id` 要踢的 QQ 号
> - `reject_add_request` 拒绝此人的加群请求

## setGroupBan
> `setGroupBan(groupId: number, userId: number, duration?: number): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 群组单人禁言
> - `group_id` 群号
> - `user_id` 要禁言的 QQ 号
> - `duration` 禁言时长，单位秒，0 表示取消禁言

## setGroupAnonymousBan
> `setGroupAnonymousBan(groupId: number, anonymousFlag: string, duration?: number): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 群组匿名用户禁言
> - `group_id` 群号
> - `anonymous_flag` 或 flag 可选，要禁言的匿名用户的 flag（需从群消息上报的数据中获得）
> - `duration` 禁言时长，单位秒，无法取消匿名用户禁言  

## setGroupWholeBan
> `setGroupWholeBan(groupId: number, enable?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 群组全员禁言
> - `group_id` 群号
> - `enable` 是否禁言

## setGroupAdmin
> `setGroupAdmin(groupId: number, userId: number, enable?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 群组设置管理员
> - `group_id` 群号
> - `user_id` 要设置管理员的 QQ 号
> - `enable` true 为设置，false 为取消

## setGroupAnonymous
> `setGroupAnonymous(groupId: number, enable?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 群组匿名
> - `group_id` 群号
> - `enable` 是否允许匿名聊天

## setGroupCard
> `setGroupCard(groupId: number, userId: number, card?: string): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 设置群名片（群备注）
> - `group_id` 群号
> - `user_id` 要设置的 QQ 号
> - `card` 群名片内容，不填或空字符串表示删除群名片

## setGroupLeave
> `setGroupLeave(groupId: number, isDismiss?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 退出群组
> - `group_id` 群号
> - `is_dismiss` 是否解散，如果登录号是群主，则仅在此项为 true 时能够解散

## setGroupSpecialTitle
> `setGroupSpecialTitle(groupId: number, userId: number, specialTitle?: string, duration?: number): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 设置群组专属头衔
> - `group_id` 群号
> - `user_id` 要设置的 QQ 号
> - `special_title` 专属头衔，不填或空字符串表示删除专属头衔
> - `duration` 专属头衔有效期，单位秒，-1 表示永久，不过此项似乎没有效果，可能是只有某些特殊的时间长度有效，有待测试

## setDiscussLeave
> `setDiscussLeave(discussId: number): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 退出讨论组
> - `discuss_id` 讨论组 ID（正常情况下看不到，需要从讨论组消息上报的数据中获得）

## setFriendAddRequest
> `setFriendAddRequest(flag: string, approve?: boolean, remark?: string): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 处理加好友请求
> - `flag` 加好友请求的 flag（需从上报的数据中获得）
> - `approve` 是否同意请求
> - `remark` 添加后的好友备注（仅在同意时有效）

## setGroupAddRequest
> `setGroupAddRequest(flag: string, subType: 'add' | 'invite', approve?: boolean, reason?: string): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 处理加群请求／邀请
> - `flag` 加群请求的 flag（需从上报的数据中获得）
> - `subType` add 或 invite，请求类型（需要和上报消息中的 sub_type 字段相符）
> - `approve` 是否同意请求／邀请
> - `reason` 拒绝理由（仅在拒绝时有效）

## getLoginInfo
> `getLoginInfo(): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetLoginInfoResponseData`](#cqhttpgetlogininforesponsedata)`>>`  
> 获取登录号信息

## getStrangerInfo
> `getStrangerInfo(userId: number, noCache?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetStrangerInfoResponseData`](#cqhttpgetstrangerinforesponsedata)`>>`  
> 获取陌生人信息
> - `user_id` QQ 号
> - `no_cache` 是否不使用缓存（使用缓存可能更新不及时，但响应更快）

## getGroupList
> `getGroupList(): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetGroupListResponseData`](#cqhttpgetgrouplistresponsedata)`[]>>`  
> 获取群列表

## getGroupMemberInfo
> `getGroupMemberInfo(groupId: number, userId: number, noCache?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetGroupMemberInfoResponseData`](#cqhttpgetgroupmemberinforesponsedata)`>>`  
> 获取群成员信息
> - `group_id` 群号
> - `user_id` QQ 号
> - `no_cache` 是否不使用缓存（使用缓存可能更新不及时，但响应更快）

## getGroupMemberList
> `getGroupMemberList(groupId: number): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetGroupMemberInfoResponseData`](#cqhttpgetgroupmemberinforesponsedata)`[]>>`  
> 获取群成员列表
> - `group_id` 群号

## getCookies
> `getCookies(): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetCookiesResponseData`](#cqhttpgetcookiesresponsedata)`>>`  
> 获取 cookies

## getCsrfToken
> `getCsrfToken(): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetCsrfTokenResponseData`](#cqhttpgetcsrftokenresponsedata)`>>`  
> 获取 csrf token

## getCredentials
> `getCredentials(): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetCookiesResponseData`](#cqhttpgetcookiesresponsedata)` & `[`CQHTTP.GetCsrfTokenResponseData`](#cqhttpgetcsrftokenresponsedata)`>>`  
> 获取 qq 相关接口凭证 即 getCookies getCsrfToken 两个接口的合并。

## getRecord
> `getRecord(file: string, outFormat: string, fullPath?: boolean): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetFileResponseData`](#cqhttpgetfileresponsedata)`>>`  
> 获取语音 其实并不是真的获取语音，而是转换语音到指定的格式，然后返回语音文件名（data\record 目录下）。注意，要使用此接口，需要安装 酷Q 的 语音组件。
> - `file` 收到的语音文件名（CQ 码的 file 参数），如 0B38145AA44505000B38145AA4450500.silk
> - `out_format` 要转换到的格式，目前支持 mp3、amr、wma、m4a、spx、ogg、wav、flac
> - `full_path` 是否返回文件的绝对路径（Windows 环境下建议使用，Docker 中不建议）

## getImage
> `getImage(file: string): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetFileResponseData`](#cqhttpgetfileresponsedata)`>>`  
> 获取图片
> - `file` 收到的图片文件名（CQ 码的 file 参数），如 6B4DE3DFD1BD271E3297859D41C530F5.jpg

## canSendImage
> `canSendImage(): Promise<CQHTTP.ResponseData<`[`CQHTTP.CanSendResponseData`](#cqhttpcansendresponsedata)`>>`  
> 检查是否可以发送图片

## canSendRecord
> `canSendRecord(): Promise<CQHTTP.ResponseData<`[`CQHTTP.CanSendResponseData`](#cqhttpcansendresponsedata)`>>`  
> 检查是否可以发送语音

## getStatus
> `getStatus(): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetStatusResponseData`](#cqhttpgetstatusresponsedata)`>>`  
> 获取插件运行状态  
> _通常情况下建议只使用 online 和 good 这两个字段来判断运行状态，因为随着插件的更新，其它字段有可能频繁变化。  其中，online 字段的在线状态检测有两种方式，可通过 online_status_detection_method 配置项切换，默认通过读取 酷Q 日志数据库实现，可切换为 get_stranger_info 以通过测试陌生人查询接口的可用性来检测_

## getVersionInfo
> `getVersionInfo(): Promise<CQHTTP.ResponseData<`[`CQHTTP.GetVersionInfoResponseData`](#cqhttpgetversioninforesponsedata)`>>`  
> 获取 酷q 及 http api 插件的版本信息

## setRestartPlugin
> `setRestartPlugin(delay?: number): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 重启 http api 插件 由于重启插件同时需要重启 API 服务，这意味着当前的 API 请求会被中断，因此需在异步地重启插件，接口返回的 status 是 async。
> - `delay` 要延迟的毫秒数，如果默认情况下无法重启，可以尝试设置延迟为 2000 左右

## cleanDataDir
> `cleanDataDir(dataDir: string): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 清理数据目录 用于清理积攒了太多旧文件的数据目录，如 image。
> - `data_dir` 收到清理的目录名，支持 image、record、show、bface

## cleanPluginLog
> `cleanPluginLog(): Promise<CQHTTP.ResponseData<`[`CQHTTP.EmptyResponseData`](#cqhttpemptyresponsedata)`>>`  
> 清理插件日志 用于清空插件的日志文件。

## CQHTTP.SendMsgResponseData
> `message_id`: `number` 消息ID  

## CQHTTP.EmptyResponseData
无响应数据内容  

## CQHTTP.GetLoginInfoResponseData
> `user_id`: `number` QQ号  
> `nickname`: `string` QQ昵称  


## CQHTTP.GetStrangerInfoResponseData
> `user_id`: `number` QQ号  
> `nickname`: `string` 昵称  
> `sex`: `'male' | 'female' | 'unknown'` 性别  
> `age`: `number` 年龄  

## CQHTTP.GetGroupListResponseData
> `group_id`: `number` 群号  
> `group_name`: `string` 群名称

## CQHTTP.GetGroupMemberInfoResponseData
> `group_id`: `number` 群号  
> `user_id`: `number` QQ 号  
> `nickname`: `string` 昵称  
> `card`: `string` 群名片／备注  
> `sex`: `'male' | 'female' | 'unknown'` 性别  
> `age`: `number` 年龄  
> `area`: `string` 地区  
> `join_time`: `number` 加群时间戳  
> `last_sent_time`: `number` 最后发言时间戳  
> `level`: `string` 成员等级  
> `role`: `'owner' | 'admin' | 'member'` 角色,群主/管理员/群成员  
> `unfriendly`: `boolean` 是否不良记录成员  
> `title`: `string` 专属头衔  
> `title_expire_time`: `number` 专属头衔过期时间戳  
> `card_changeable`: `boolean` 是否允许修改群名片  

## CQHTTP.GetCookiesResponseData
> `cookies`: `string` Cookies  

## CQHTTP.GetCsrfTokenResponseData
> `token`: `number` CSRF Token  

## CQHTTP.GetFileResponseData
> `file`: `string` 转换后的语音文件名或路径  

## CQHTTP.CanSendResponseData
> `yes`: `boolean` 转换后的语音文件名或路径  

## CQHTTP.GetStatusResponseData
> `app_initialized`: `boolean` HTTP API 插件已初始化  
> `app_enabled`: `boolean` HTTP API 插件已启用  
> `plugins_good`: `object` HTTP API 的各内部插件是否正常运行  
> `app_good`: `boolean` HTTP API 插件正常运行（已初始化、已启用、各内部插件正常运行）  
> `online`: `boolean` 当前 QQ 在线，null 表示无法查询到在线状态  
> `good`: `boolean` HTTP API 插件状态符合预期，意味着插件已初始化，内部插件都在正常运行，且 QQ 在线
  
## CQHTTP.GetVersionInfoResponseData  
> `coolq_directory`: `string` 酷Q 根目录路径  
> `coolq_edition`: `'air' | 'pro'` 酷Q 版本  
> `plugin_version`: `string` HTTP API 插件版本，例如 2.1.3  
> `plugin_build_number`: `number` HTTP API 插件 build 号  
> `plugin_build_configuration`: `'debug' | 'release'` HTTP API 插件编译配置  
