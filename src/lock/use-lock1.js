// 2个不同代码的进程，lock unlock isLocked  + lock有问题？，curTimeOut + lock的原子性问题？？

// +cluster，fock出多个进程，操作锁
const Locker = require('./lock.js')
const cluster  = require('cluster')
const path = require('path')
const fs = require('fs')
const msgQueue = []
const locker = new Locker()
let initTimeOut = 0.5 // ms
let additionalTimeOut = 0.5 // 每次额外再给的超时增量
let curTimeOut = initTimeOut // ms
let hasFinishEachTask = false
let timer = null

// 超时后延长超时时间
function handleCurTimeOut () {
  if (!additionalTimeOut) return
  timer && clearTimeout(timer)
  timer = setTimeout(() => {
    if (!hasFinishEachTask) {
      curTimeOut = additionalTimeOut
      locker.changeTimeOut(additionalTimeOut) // 再给额外additionalTimeOut的时间
      handleCurTimeOut()
    } else {
      clearTimeout(timer)
      curTimeOut = initTimeOut // 重置
    } }, curTimeOut)
}

function writeWorkerFile (msg) {
  hasFinishEachTask = false // 初始值
  handleCurTimeOut()
  locker.lock(initTimeOut).then(() => {
    // 优先写入最新的：
    fs.writeFile(path.resolve(__dirname, './test.txt'), msg.fileTxt, err => {
      hasFinishEachTask = true
      if (err) {
        return console.error(err)
      }
      console.log()
      console.log(`${msg.workerId}文件已写入`)
      msg.cb && msg.cb()
      // 其次写入队列的第一个
      locker.unLock().then(() => {
        if (msgQueue.length) {
          writeWorkerFile(msgQueue.shift(0))
        }
      })
    })
  }).catch(e => {
    console.log(`${msg.workerId}: 锁文件有误`)
    console.error(e)
    // TODO: 怎么再次请求资源？？或其他处理？？
    msg.errorCb && msg.errorCb()
  })
}

function run () {
  if (cluster.isMaster) {
    const cpuNums = require('os').cpus().length
    console.log(`cpuNums = `, cpuNums)
    for (let i = 0; i < cpuNums; i++) {
      let wkProcess = cluster.fork()
      wkProcess.on('message', (msg) => {
        if (msg && msg.needWrite) {
          console.log()
          console.log('workerId = ', msg.workerId)
          if (!locker.isLocked()) {
            console.log(`${msg.workerId}：可写入文件资源~`)
            writeWorkerFile(msg)
          } else {
            console.log(`${msg.workerId}：等待文件资源中~`)
            msgQueue.push(msg)
          }
        }
      })
    }
  } else {
    // let count = 10000000 // ？？是否count很大，会出现竞争写入文件
    let count = 2
    for (let i = 0; i < count; i++) { // 频繁要求资源
      setTimeout(() => {
        // 发送信息：要写入文件的消息
        process.send({
          fileTxt: `Now 进程 workerId = ${cluster.worker.id}; index = ${i}`,
          needWrite: true,
          workerId: cluster.worker.id,
          errorCb: () => {},
          cb: () => {}
        })
      }, Math.random())
    }
    console.log(`ChildProcess ${cluster.worker.id}:`) // 进程间的的globalData不共享，有各自的内存资源
    console.log()
  }
}
run()