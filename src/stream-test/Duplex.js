// Duplex拥有Writable和Readable所有方法和事件， 但各自独立缓存区
const Duplex = require('stream').Duplex
let i = 0
const dp = Duplex({
  readableHighWaterMark: 8,
  read: (size) => {
    console.log(`size = ${size}; i = ${i}`)
    if (i < 8) {
      dp.push(`当前读取数据:${i++}`)
    } else {
      dp.push(null)
    }
  },
  write: (chunk, encoding, cb) => {
    console.log('encoding = ', encoding)
    process.stdout.write(chunk.toString().toUpperCase())
    process.nextTick(cb)
  }
})
dp.on('readable', () => {
  const data = dp.read(8) // 每次读取8个字符
  console.log(data)
})
dp.setEncoding('utf8') // readable的方法
dp.write(`---------------- a\n`)
dp.write(`---------------- b\n`)
dp.write(`---------------- c\n`)

dp.on('finish', () => {
  process.stdout.write('---------------- Done!\n')
})
dp.end()