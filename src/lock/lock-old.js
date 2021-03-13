// 进程间写入文件的锁

const fs = require('fs')
const path = require('path')
const lockDir = path.resolve(__dirname, `my/${Date.now()}-lock`)

let hasLock = false // 是否已经锁住 【互斥量】

function lock (cb) {
  if (hasLock) return cb()

  fs.mkdir(lockDir + `/${process.pid}`, err => {
    if (err) return cb(err)
    console.log('目录已新建')
    fs.writeFile(lockDir + `/${process.pid}`, err => {
      if (err) console.error(err)
      hasLock = true
      console.log('文件已写入')
      cb()
    })
  })
}

function unLock (cb) {
  if (!hasLock) return cb()

  fs.unlink(lockDir + `/${process.pid}`, (err) => {
    if (err) return cb(err)
    console.log('文件已删除')
    fs.rmdir(lockDir, err => {
      if (err) return cb(err)
      hasLock = false
      console.log('目录已删除')
      cb()
    })
  })
}

// 退出的时候，强制删除锁
process.on('exit', () => {
  unLock(() => {})
})

module.exports = {
  lock,
  unLock
}

