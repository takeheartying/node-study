class Locker {
  constructor (timeOut) {
    this.lockFlag = false
    this.timeOut = timeOut
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
          setTimeout(() => {
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
        this.lockFlag = false
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}
module.exports = Locker