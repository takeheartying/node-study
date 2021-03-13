const Readable = require('stream').Readable
let i = 0
const readStream = Readable({
  encoding: 'utf8',
  highWaterMark: 8, // 缓存区字节大小
  read: (size) => { // 这里的size即为highWaterMark；没有数据了就不会执行_read
    console.log(`size = ${size}; i = ${i}`)
    if (i < 8) {
      readStream.push(`当前读取数据:${i++}`)
    } else {
      readStream.push(null)
    }
  },
  destroy (err, cb) {
    readStream.push(null)
    cb(err)
  }
})
readStream.on('readable', () => {
  const data = readStream.read(8) // 每次读取8个字符
  console.log(data)
})
process.on('exit', () => {
  console.error(`\ni = ${i} `)
})