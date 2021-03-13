const { parentPort } = require('worker_threads')
const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, './file.txt'), (err) => {
  if (err) throw err
  parentPort.postMessage('文件已读取')
})