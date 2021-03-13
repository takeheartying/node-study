// 3.用原生模块实现多进程（线程） 锁
// 或基于 Redis 实现分布式锁
const path = require('path')
const { Worker } = require('worker_threads')

function getReadWorker () {
  let readWorkder = new Worker(path.join(__dirname, 'file-read.js'))
  readWorkder.on('message', data => {
    console.log('data = ', data)
  })
  readWorkder.on('error', err => {
    console.error('readWorkder的error = ', err)
  })
  readWorkder.on('exit', exitCode => {
    if (exitCode === 0) {
      return null
    }
    console.log(`readWorkder has stopped with code ${exitCode}`)
  })
  return readWorkder
}

function getWriteWorker () {
  let writeWorkder = new Worker(path.join(__dirname, 'file-write.js'))
  writeWorkder.on('message', data => {
    console.log('data = ', data)
  })
  writeWorkder.on('error', err => {
    console.error('readWorkder的error = ', err)
  })
  writeWorkder.on('exit', exitCode => {
    if (exitCode === 0) {
      return null
    }
    console.log(`readWorkder has stopped with code ${exitCode}`)
  })
  return writeWorkder
}

// for (let i = 0; i < 1000000; i++) {
//   getWriteWorker()
//   getReadWorker()
// }