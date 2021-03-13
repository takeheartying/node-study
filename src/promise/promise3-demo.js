// 1. 实现 Promise / A + 规范
// 官网： https: //promisesaplus.com/
// 测试用例： https: //github.com/promises-aplus/promises-tests

const MyPromise = require('./promise3')

let promise1 = new MyPromise(function (resolve, reject) {
  resolve('reslove promise');
  // reject('reject promise');
});

let promise2 = promise1.then(function onReslove(value) {
  console.log('1 resolve: ', value);
  // return 1; // 回调类型是String
  // throw new Error('this is an error') // 执行onReslove() 会报错
  return new Promise((res, rej) => {
    res('返回的是3')
  })
}, function onReject(reason) {
  console.log('1 reason: ', reason);
  return 2
});

promise2.then(function onReslove(value) {
  console.log('2 resolve: ', value);
}, function onReject(reason) {
  console.log('2 reason: ', reason);
})