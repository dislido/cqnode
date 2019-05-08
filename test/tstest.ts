interface Obj1 {
  foo: number;
}
const obj1 = {
  foo: 123,
}

interface Obj2 {
  bar: number;
}
const obj2 = {
  bar: 321,
}

new Proxy(obj1, {
  get: (target, name: keyof Obj1 | keyof Obj2) => {
    if (name in target) return target[name];
    if (name in obj2) return obj2[name];
  },
});