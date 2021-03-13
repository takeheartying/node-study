// $ node src / stream - test / Readable2.js
/** 
  为了说明只有在数据消耗者出现时， _read函数才会被调用
  $ node src / stream - test / Readable2.js  | head -c5 
  【_read函数也可以获取一个size参数来指明消耗者想要「读取」多少比特的数据: 
  usage: head [-n lines | -c bytes] [file ...]】
**/

const Readable = require('stream').Readable
const readStream = new Readable()
let c = 97
readStream._read = function () {
  if ('z'.charCodeAt(0) >= c) {
    setTimeout(() => {
      readStream.push(String.fromCharCode(c)) // 还原字母
      c++
    }, 100)
  } else {
    readStream.push(null) // 结束
  }
}
readStream.pipe(process.stdout)

process.stdout.on('error', err => { // process.stdout将会捕获到一个 write EPIPE 错误
  console.error(`\n`)
  console.error(err)
  process.exit()
})
process.on('exit', () => {
  console.error(`\n_read 被执行了 ${c - 97} 次`)
})