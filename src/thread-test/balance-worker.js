const { workerData, parentPort } = require('worker_threads')
const count = 1e10 // 1000000  1e10
console.log('worker的workerData = ', workerData)

function changeBalance() { // 可能造成内存溢出
  workerData.balance = workerData.balance + workerData.num
  workerData.balance = workerData.balance - workerData.num
  console.log('计算的balance = ', workerData.balance)
}
function runThread() {
  for (let i = 0; i <= count; i++) {
    changeBalance()
  }
  parentPort.postMessage(workerData)
}
runThread()