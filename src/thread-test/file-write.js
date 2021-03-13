const { parentPort } = require('worker_threads')
const fs = require('fs')
const path = require('path')

const data = new Uint8Array(Buffer.from('这是一个文本'))
fs.writeFile(path.resolve(__dirname, './file.txt'), data, (err) => {
  if (err) throw err
  parentPort.postMessage('文件已写入')
})