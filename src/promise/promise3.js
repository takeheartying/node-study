// 1. 实现 Promise / A + 规范
// 官网： https: //promisesaplus.com/
// 测试用例： https: //github.com/promises-aplus/promises-tests

// 空函数
function noop() {}

// 第三阶段：针对执行回调returnX的多种数据类型【value或reason】做处理：带到下一个then
// 如果onResolved或onRejected返回一个x，那么promise2的状态需要根据x来决定
class MyPromise {
  constructor(executor = noop) { // 入参是一个方法，function executor（resolve,reject） {}，执行方法需要2个传参
    // 初始值：
    this.status = 'PENDING'
    this.value = undefined
    this.reason = undefined

    this.resolvedCbList = []
    this.rejectedCbList = []
    const resolve = (val) => {
      if (this.status === 'PENDING') {
        this.status = 'FULFILLED'
        this.value = val
        this.resolvedCbList.forEach(fn => fn())
      }
    }
    const reject = (reason) => {
      if (this.status === 'PENDING') {
        this.status = 'REJECTED'
        this.reason = reason
        this.rejectedCbList.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onResolved = noop, onRejected = noop) { // 不传默认为空函数
    let p2 = new MyPromise()
    if (this.status === 'PENDING') {
      // 存入待处理的方法到列表：
      this.resolvedCbList.push(() => onResolved(this.value))
      this.rejectedCbList.push(() => onRejected(this.reason))
    } else if (this.status === 'FULFILLED') {
      // 执行最后完成的方法：
      const returnX = onResolved(this.value) // 获取回调的结果给到下一个 then
      resolvePromise(p2, returnX, onResolved, onRejected)
    } else if (this.status === 'REJECTED') {
      // 执行最后报错的方法
      const returnX = onRejected(this.reason) // 获取回调的结果给到下一个 then
      resolvePromise(p2, returnX, onResolved, onRejected)
    }
    return p2
  }
}
// 处理then方法return后返回结果p2 的状态，使得每一个then方法执行后return结果带到下一个
function resolvePromise(promise2, x, resolve, reject) { // x: then方法内return的结果回调，可以为各种数据类型
  if (promise2 === x) {
    return reject(new TypeError('检测到链式循环'))
  }
  let isCalled = false
  if ((typeof x === 'object' && typeof x !== 'null') || typeof x === 'function') {
    try {
      let then = x.then
      // 判断是否是promise
      if (typeof then === 'function') {
        then.call(x, (result) => {
          // console.log(`result = ${result}; isCalled = ${isCalled}`)
          if (isCalled) return
          isCalled = true
          resolvePromise(promise2, result, resolve, reject)
        }, (reason) => {
          if (isCalled) return
          isCalled = true
          reject(reason)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (isCalled) return
      isCalled = true
      reject(e)
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 普通值执行回调
    resolve(x)
  }
}
module.exports = MyPromise