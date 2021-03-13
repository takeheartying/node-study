// 3.用原生模块实现多进程（线程） 锁
// 或基于 Redis 实现分布式锁
const path = require('path')
const { Worker, isMainThread, workerData } = require('worker_threads')
let obj = {
  balance: 0, // 计算数字
  num: 0 // 编号
}

function getWorker (num) {
  obj.num = num
  let worker = new Worker(path.join(__dirname, 'balance-worker.js'), {
    workerData: obj
  })
  worker.on('message', data => {
    console.log('data = ', data)
    console.log(`data === obj ? `, data === obj)
  })
  worker.on('error', err => {
    console.error('worder的error = ', err)
  })
  worker.on('exit', exitCode => {
    if (exitCode === 0) {
      return null
    }
    console.log(`Worker has stopped with code ${exitCode}`)
  })
  return worker
}

function run (num) {
  if (isMainThread) {
    const worker = getWorker(num)
  } else {
    console.log(workerData)
  }
}

// 循环：
function foreachRun () {
  for (let i = 0; i < 2; i++) {
    run(i)
  }
}
foreachRun()
