// 目标服务器
const port = 8085
const path = require('path')
const fs = require('fs')
const http = require('http')
const sirv = require('sirv')

// start static file server
const staticServe = sirv(path.resolve(__dirname, '../public'))
const server = http.createServer(function (req, res) {
  // res.setHeader('Content-Type', 'application/json') // 浏览器显示中文
  console.log('req.url = ', req.url)
  if (req.url.includes('/a')) {
    res.end('this is a')
  } else if (req.url.includes('/b')) {
    res.end('this is b')
  } else if (req.url.includes('/text')) {
    let readStream = fs.createReadStream(path.resolve(__dirname, './target-text.txt'), 'utf-8')
    readStream.on('data', (chunk) => {
      console.log('目标服务器静态文件 - text = ', chunk)
    })
    readStream.on('error', (err) => {
      console.error(err)
    })
    readStream.on('end', () => {
      console.log('目标服务器读取end')
    })
    readStream.pipe(res)
  } else {
    staticServe(req, res)
  }
  req.setEncoding('utf-8')
})
server.listen(port, () => {
  console.log('目标服务器 正在启动, port = ' + port)
})
