import WorkpathManager from ".";

export default class JsonStorage<T = any> {
  private static _instances: { [path: string]: JsonStorage } = {};
  private _data: T;
  /**
   * 若为false，当前data已经写入或正在写入文件
   * 若为true，之前data的写入还未完成，完成后需要再次触发写入当前data
   */
  private _shouldWrite = false;
  /** 是否正在写入文件 */
  private _writing = false;
  private _ready: Promise<void>;
  
  constructor(private path: string, defaultData: T = {} as T, private workpath: WorkpathManager) {
    if (JsonStorage._instances[path]) return JsonStorage._instances[path];
    JsonStorage._instances[path] = this;
    this._ready = workpath.readJson<T>(path, defaultData).then(data => {
      this._data = data;
    });
  }

  ready() {
    return this._ready;
  }

  get() {
    return this._data;
  }

  set(data: T) {
    this._data = data;
    if (this._shouldWrite === true) return;
    if (!this._writing) this.write();
    else this._shouldWrite = true;
  }

  private write() {
    this._shouldWrite = false;
    this._writing = true;
    this.workpath.writeJson(this.path, this._data).then(() => {
      if (this._shouldWrite === true) this.write();
      else this._writing = false;
    });
  }
}
