const cp = require('child_process')
const path = require('path')

const sp1 = cp.spawn('node', ['test1.js'], {
  timeout: 1000, // 运行超时时间
  maxBuffer: 100 * 1024, // 标准输出、错误输出最大允许的数据量（单位为字节），如果超出的话，子进程就会被杀死
  cwd: path.join(__dirname, './') // 指定子进程的当前工作目录
})
const sp2 = cp.spawn('node', ['test2.js'], {
  stdio: 'pipe',
  cwd: path.join(__dirname, './') // 指定子进程的当前工作目录
})
sp1.on('exit', function (code, signal) {
  console.log('子进程1退出，退出代码为：' + code)
  // process.exit()
})
sp1.on('error', function (err) {
  console.error('子进程开启失败: ' + err)
  process.exit()
})
sp1.stdout.on('data', function (data) {
  console.log('子进程1标准输出: ' + data)
  // sp2.stdin.write(data) // 输入写到子进程2
})
sp1.stderr.on('data', function (err) {
  console.log('子进程1错误输出: ' + err)
  if (err.code == 'EPIPE') {
    process.exit(0)
  }
})

sp2.on('exit', function (code, signal) {
  console.log('子进程2退出，退出代码为：' + code)
  process.exit()
})
sp2.on('error', function (err) {
  console.error('子进程开启失败: ' + err)
  process.exit()
})
sp2.stdout.on('data', function (data) {
  console.log('子进程2标准输出: ' + data)
})
sp2.stderr.on('data', function (err) {
  console.log('子进程2错误输出: ' + err)
})