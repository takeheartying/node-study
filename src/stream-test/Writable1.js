const { Buffer } = require('buffer')

const Writable = require('stream').Writable
const wr = Writable({
  objectMode: true,
  write: (data, enc, next) => {
    process.stdout.write(data.toString().toUpperCase(), err => {
      if (err) return console.error(err)
    })
    // 写入完成时，调用`next()`方法通知流传入下一个数据
    process.nextTick(next)
  }
})
// 所有数据均已写入底层
wr.on('finish', () => {
  process.stdout.write('finished!')
})

wr.write(`a\n`)
wr.write(`b\n`)
wr.write(`c\n`)
// objectMode设为 true，则除了字符串、 Buffer 或 Uint8Array，还可以写入流实现支持的其他 JavaScript 值
wr.write({
  'name': 'lxy'
})

// 再无数据写入流时，需要调用`end`方法
wr.end()