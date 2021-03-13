const fs = require('fs')
const path = require('path')

console.log('这是子进程2')
fs.mkdir(path.resolve(__dirname, 'myDir'), { recursive: true },(err) => {
  if (err) return console.error(err)
  console.log('test2 创建目录成功')
  fs.writeFile(path.resolve(__dirname, 'myDir/test.js'), 'console.log(2222222222222222222222)', err => {
    if (err) return console.error(err)
    console.log('test2 写入文件成功')
  })
})