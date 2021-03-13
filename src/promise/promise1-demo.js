const MyPromise = require('./promise1')
let p1 = new MyPromise((resovle, reject) => {
  if (Math.ceil(Math.random() * 10) % 2 === 0) { // 奇数
    resovle('奇数')
  } else { // 偶数
    reject('偶数')
  }
})
let p2 = p1.then(res => {
  console.log(res)
}, e => {
  console.log(e)
})
console.log(p2) // undefined