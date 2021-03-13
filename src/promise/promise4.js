// 1. 实现 Promise / A + 规范
// 官网： https: //promisesaplus.com/
// 测试用例： https: //github.com/promises-aplus/promises-tests

// 空函数
function noop() {}

// 第四阶段：处理promises-aplus-tests 这个工具 - 实现一个静态方法deferred
class MyPromise {
  constructor(executor = noop) { // 入参是一个方法，function executor（resolve,reject） {}，执行方法需要2个传参
    // 初始值：
    this.status = 'PENDING'
    this.value = undefined
    this.reason = undefined

    this.resolvedCbList = []
    this.rejectedCbList = []
    const resolve = (val) => {
      // 如果是promise 继续执行他的then
      if (val instanceof MyPromise) {
        value.then(resolve, reject)
        return
      }
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

  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
    let p2 = new MyPromise((resolve, reject) => {
      if (this.status === 'PENDING') {
        // 存入待处理的方法到列表：
        this.resolvedCbList.push(() => {
          // 因为then的回调是放在异步，所以这里暂时用宏任务settimeout来模拟
          setTimeout(() => {
            try {
              let returnX = onFulfilled(this.value) // x: 普通值 or promise
              // resolve、reject 是用来改变状态，所以需要传进去
              resolvePromise(promise2, returnX, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.rejectedCbList.push(() => {
          setTimeout(() => {
            try {
              let returnX = onRejected(this.reason)
              resolvePromise(promise2, returnX, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      } else if (this.status === 'FULFILLED') {
        setTimeout(() => {
          try {
            const returnX = onFulfilled(this.value) // 获取回调的结果给到下一个 then
            resolvePromise(p2, returnX, onFulfilled, onRejected)
          } catch (e) {
            reject(e)
          }
        }, 0)
      } else if (this.status === 'REJECTED') {
        setTimeout(() => {
          try {
            // 执行最后报错的方法
            const returnX = onRejected(this.reason) // 获取回调的结果给到下一个 then
            resolvePromise(p2, returnX, onFulfilled, onRejected)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
    })
    return p2
  }

  // 捕获异常
  catch (errCallBack) {
    return this.then(null, errCallBack)
  }

  // 返回一个promise，在promise结束时，无论结果是fulfilled或者是rejected，都会执行指定的回调函数
  finally (cb) {
    this.then(value => {
      return MyPromise.resolve(cb()).then(_ => value)
    }, reason => {
      return MyPromise.resolve(callback()).then(() => {
        throw reason
      })
    })
  }

  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }

  static resolve (value) {
    return new MyPromise((resolve, reject) => {
      resolve(value)
    })
  }

}

// 处理then方法return后返回结果p2 的状态，使得每一个then方法执行后return结果带到下一个
function resolvePromise(promise2, x, resolve, reject) { // x: then方法内return的结果回调，可以为各种数据类型
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<MyPromise>')) // 检测到链式循环
  }
  let isCalled = false
  if ((typeof x === 'object' && typeof x !== 'null') || typeof x === 'function') {
    try {
      let then = x.then
      // 判断是否是promise
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if (isCalled) return
          isCalled = true
          resolvePromise(promise2, y, resolve, reject)
        }, (r) => {
          if (isCalled) return
          isCalled = true
          reject(r)
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

// 按照标准
MyPromise.defer = MyPromise.deferred = function () {
  let deferred = {}

  deferred.promise = new MyPromise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  return deferred
}
module.exports = MyPromise