const fs = require('fs')
const path = require('path')
const http = require('http')
const oppressor = require('oppressor')

const server = http.createServer(function (req, res) {
  if (req.url.includes('/favicon.ico')) return res.end(null)

  const readStream = fs.createReadStream(path.resolve(__dirname, './data.txt'), 'utf8')
  // push -- 其实是把数据放入缓存区
  readStream.push(`There are some new words!\n `)
  readStream.unshift(`Happy new year! \n`)
  readStream.unshift(`hhhh \n`)

  // readStream.read(6)

  const writeStream = fs.createWriteStream(path.resolve(__dirname, './write-data.txt'), 'utf8')
  readStream.on('data', (chunk) => {
    console.log('\n读取到 %d 个字符的字符串数据:', chunk.length);
    console.log(chunk)
    writeStream.write(`(后面${chunk.length}个字符)`)
  });
  readStream.on('end', function () { // 当没有数据时，关闭数据流
    writeStream.end()
  })


  readStream.pipe(writeStream) // 读出的管道数据流向写管道 - pipe自动调用了data,end等事件

  res.setHeader('Content-Type', 'application/json') // 浏览器显示中文
  // readStream.pipe(res)
  readStream.pipe(oppressor(req)).pipe(res) // 请求经过oppressor压缩为gzip后流向响应 【st = oppressor(req) 中，st是个duplex双向流】
})
server.listen(8087)
