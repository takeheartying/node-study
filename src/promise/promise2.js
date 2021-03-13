// 1. 实现 Promise / A + 规范
// 官网： https: //promisesaplus.com/
// 测试用例： https: //github.com/promises-aplus/promises-tests

// 空函数
function noop() {}

// 第二阶段：链式操作实现：
class myPromise {
  constructor(executor = noop) { // 入参是一个方法，executor（resolve,reject），执行方法需要2个传参
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

  then (onResolved = noop, onRejected = noop) { // 不传默认为空函数
    if (this.status === 'PENDING') {
      // 存入待处理的方法到列表：
      this.resolvedCbList.push(() => onResolved(this.value))
      this.rejectedCbList.push(() => onRejected(this.reason))
    } else if (this.status === 'FULFILLED') {
      // 执行最后完成的方法：
      onResolved(this.value)
    } else if (this.status === 'REJECTED') {
      // 执行最后报错的方法
      onRejected(this.reason)
    }
    console.log('当前状态：', this.status) // 日志，可去除
    let p = new myPromise((newResolve, newReject) => {
      // 链式操作，将每次的结果传递给下一个then方法入参 的传参 【TODO：写死根据第一个promise状态带下去，未处理新的then方法的return 回调？怎么给？】
      if (this.status === 'FULFILLED') { // 旧状态是 完成后的返回
        newResolve && newResolve(this.value)
      }
      if (this.status === 'REJECTED') { // 旧状态是 报错的返回
        newReject && newReject(this.reason)
      }
    })
    return p
  }
}
module.exports = myPromise