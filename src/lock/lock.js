class Locker {
  constructor (timeOut) {
    this.lockFlag = false
    this.timeOut = timeOut
    this.timer = null
  }
  isLocked () {
    return this.lockFlag
  }
  lock () {
    return new Promise((resolve, reject) => {
      try {
        if (this.lockFlag) return resolve(null)
        this.lockFlag = true
        if (this.timeOut) {
          this.timer && clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            console.log('超时解锁啦，使用者自己处理？')
            this.unLock().catch(e => {
              throw new Error(e)
            })
          }, this.timeOut)
        }
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }
  unLock () {
    return new Promise((resolve, reject) => {
      try {
        if (!this.lockFlag) return resolve(null)
        this.timer = clearTimeout(this.timer)
        this.lockFlag = false
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
  changeTimeOut (timeOut) {
    return new Promise((resolve, reject) => {
      try {
        this.timeOut = timeOut
        if (this.timeOut) {
          this.timer && clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            console.log(`修改后的超时时间${this.timeOut}ms到期，使用者自己处理？`)
            this.unLock().catch(e => {
              throw new Error(e)
            })
          }, this.timeOut)
        }
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }
}
module.exports = Locker