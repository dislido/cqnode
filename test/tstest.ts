interface Data1Type {}
interface Data2Type {}

interface FooData1Type extends Data1Type {}
interface FooData2Type extends Data2Type {}

interface BarData1Type extends Data1Type {}
interface BarData2Type extends Data2Type {}

const funs = {
  foo(data1: FooData1Type, data2: FooData2Type) {},
  bar(data1: BarData1Type, data2: BarData2Type) {},
}

type FunName = 'foo' | 'bar';

function call(funName: FunName, data1: Data1Type, data2: Data2Type) {
  funs[funName](data1, data2);
}
