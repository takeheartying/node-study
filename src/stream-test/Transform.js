const { Transform } = require('stream')
const tm = Transform({
  transform: (chunk, encoding, cb) => {
    // 将 chunk 转换成小写
    const data = chunk.toString().toLowerCase()
    // 推送数据到可读队列。
    cb(null, data)
  }
})
tm.setEncoding('utf8') // readable的方法
tm.on('data', (chunk) => console.log(chunk))
tm.write(`A\n`)
tm.write(`B\n`)
tm.write(`C\n`)
