const fs = require('fs')
const path = require('path')
const http = require('http')

const server = http.createServer(function (req, res) {
  fs.readFile(path.resolve(__dirname, './data.txt'), 'utf-8', (err, data) => {
    if (err) return console.error(err)
    console.log(`data = `, data)
    res.end(data)
  })
})
server.listen(8088)