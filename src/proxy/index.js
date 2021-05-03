// 2. 用原生模块实现反向代理服务器
let proxyPort = 8086
let serverPort = 8085
const http = require('http')

// http 代理
const server = http.createServer(function (httpReq, httpRes) {
  console.log('httpReq.url = ', httpReq.url)
  if (httpReq.url.includes('/favicon.ico')) return httpRes.end(null)

  const options = {
    hostname: 'localhost', // 127.0.0.1
    port: serverPort,
    path: httpReq.url,
    method: httpReq.method
  }

  // 返回一个可写流的实例
  
  const realReq = http.request(options, (realRes) => { // realRes:可读可写流
    
    httpRes.setHeader('Content-Type', 'application/json') // 浏览器显示中文
    console.log(`状态码: ${realRes.statusCode}`)
    console.log(`响应头: ${JSON.stringify(realRes.headers)}`)
    httpRes.writeHead(realRes.statusCode, realRes.headers) // 设置客户端响应状态码 和 http头部
    httpReq.setEncoding('utf8') // 设置客户端encode

    realRes.pipe(httpRes)

    realRes.on('data', (chunk) => {
      console.log(`目标服务端响应的数据: ${chunk}`)
    })
    realRes.on('end', () => {
      console.log('目标服务端的响应中已无数据')
    })

  })

  realReq.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`)
  })

  realReq.on('finish', () => {
    console.log('realReq write finish !')
  })

  // 把客户端http请求数据转发给目标服务器
  httpReq.pipe(realReq)
})
server.listen(proxyPort, () => {
  console.log('http代理服务器 正在启动, port = ' + proxyPort)
})
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    server.close()
    server.listen(++proxyPort)
  } else {
    console.dir(e)
  }
})
