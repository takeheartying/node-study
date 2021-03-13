const fs = require('fs')
const path = require('path')

console.log('这是子进程1')
fs.mkdir(path.resolve(__dirname, 'myDir'), { recursive: true }, (err) => {
  if (err) return console.error(err)
  console.log('test1 创建目录成功')
  fs.writeFile(path.resolve(__dirname, 'myDir/test.js'), 'console.log(1111111111111111111)', err => {
    if (err) return console.error(err)
    console.log('test1 写入文件成功')
  })
})