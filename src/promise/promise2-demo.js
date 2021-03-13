// 1. 实现 Promise / A + 规范
// 官网： https: //promisesaplus.com/
// 测试用例： https: //github.com/promises-aplus/promises-tests

const MyPromise = require('./promise2')
let p1 = new MyPromise((resovle, reject) => {
  if (Math.ceil(Math.random() * 10) % 2 === 0) { // 奇数
    resovle('奇数')
  } else { // 偶数
    reject('偶数')
  }
})
let p2 = p1.then(res => {
  console.log(res)
  return 1 // 做不到，只能把最开始的奇数 一直带到 所有then 的传参【待改进】
}, e => {
  console.log(e)
})
let p3 = p2.then(res => {
  console.log('this is ', res)
}, e => {
  console.log('this is ', e)
})
