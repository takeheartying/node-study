const fs = require('fs');
const path = require('path')
const params = [path.resolve(__dirname, './myDir/test.js'), '{"data": "9999999999"}', 'utf-8', function (err, data) {
  if (err) console.error(err)
  this.success && this.success(data)
}.bind({
  success: function (data) {
    console.log('success')
  }
})];

fs.writeFile(...params); // 2个几乎同步执行的writeFile异步函数

params[1] = '{"data": "123123"}'
fs.writeFile(...params)