const Readable = require('stream').Readable

const readStream = new Readable()
let c = 97
readStream._read = function () {
  if ('z'.charCodeAt(0) >= c) {
    readStream.push(String.fromCharCode(c)) // 还原字母
    c++
  } else {
    readStream.push(null) // 结束
  }
}
readStream.pipe(process.stdout)
process.stdout.on('error', (err) => {
  console.error(err)
  process.exit()
})
process.on('exit', () => {
  console.error(` \n_read 被执行了 ${c - 97} 次`)
})