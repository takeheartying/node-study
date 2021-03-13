// 1. 实现 Promise / A + 规范
// 官网： https: //promisesaplus.com/
// 测试用例： https: //github.com/promises-aplus/promises-tests

// 第一阶段：基本模型方法：
class myPromise {
  constructor(executor) {
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

  then(onResolved, onRejected) {
    if (this.status === 'PENDING') {
      this.resolvedCbList.push(() => onResolved(this.value))
      this.rejectedCbList.push(() => onRejected(this.reason))
    } else if (this.status === 'FULFILLED') {
      onResolved(this.value)
    } else if (this.status === 'REJECTED') {
      onRejected(this.reason)
    }
  }
}
module.exports = myPromise