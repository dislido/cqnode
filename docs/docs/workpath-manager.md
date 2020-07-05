# workpathManager
CQNode在启动时会创建一个workpath目录用于存储各种信息，默认为`./.cqnode`，目录结构如下
```
.cqnode/
|- group/ 群
|  └ [groupId]/
|- log/ 日志
└- module/ 模块
   └ [module.inf.packageName]/
     └ (由模块自己定义)
```
workpathManager提供了一些常用函数来操作文件

所有函数的路径参数传入相对路径时默认以workpath为根路径

> [API](#api)
>> [`getWorkPath`](#getWorkPath) 获取workpath的绝对路径
>> [`ensurePath`](#ensurePath) 确保一个路径存在，若不存在会创建目录和文件
>> [`readJson`](#readJson) 以JSON格式读取文件
>> [`writeJson`](#writeJson) 以JSON格式写入文件

## API
workpathManager可以从`cqnode.workpathManager`访问
```typescript
class MyModule extends CQNode.Module {
  onRun() {
    const wp = this.cqnode.workpathManager.getWorkPath();
    console.log(wp);
  }
}
```

### resolve
> `resolve(...to: string[]): string`  
> 获取workpath的绝对路径
> - `to` 对workpath进行`path.resolve`的参数

### ensurePath
> `ensurePath(dir: string, file?: string | null, defaultFileData?: string): Promise<string>`  
> 确保一个路径存在，若不存在会创建目录和文件，如果该路径不是期望的目录或文件则会抛出错误
> - `dir` 路径，若file参数为`null`，则为目录路径
> - `file` 文件名，不传则以dir为完整文件路径，传`null`则只建立dir的目录
> - `defaultFileData` 默认文件内容，文件不存在时会创建文件并写入此内容
```typescript
ensurePath('foo/bar'); // 确保./foo/bar是文件
ensurePath('foo/bar', null); // 确保./foo/bar是目录
ensurePath('foo', 'bar', '{}'); // 确保./foo/bar文件，若文件不存在则创建文件并写入内容`{}`
```

### readJson
> `readJson(path: string, defaultData?: any): Promise<any>`  
> 以JSON格式读取文件，若文件不存在则创建文件并写入默认内容
> - `path` 路径
> - `defaultData` 文件不存在时写入默认JSON对象，默认为`{}`

### writeJson
> `writeJson(path: string, data: any): Promise<any>`  
> 以JSON格式写入文件
> - `path` 路径
> - `data` 写入的JSON对象
