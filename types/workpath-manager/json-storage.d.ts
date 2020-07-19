import WorkpathManager from ".";

export default class JsonStorage<T = any> {
  constructor(path: string, defaultData: T, workpath: WorkpathManager);

  ready(): Promise<void>;
  get(): T;
  set(data: T): void;
}
