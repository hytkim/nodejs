// timer.js
// setTimeout, setInteval
const fs = require("fs");
const process = require("process");
const os = require("os");

// console.log(process.env.username); // admin
// process.exit(); // 프로그램 강제로 종료하겠다
// console.log(os.arch()); // x64
// console.log("cpus: \n", os.cpus());// i7-core: [0~7]
console.log(os.hostname()); // Desktop-p1ttng7
// console.log(os.networkInterfaces());
// console.log(os.type());
// console.log(os.platform());
// console.log(os.release());
// console.log(os.homedir());
// console.log(os.tmpdir());
// console.log(os.totalmem());
// console.log(os.freemem());

setTimeout(() => {
  // console.log("one time");
}, 1000);

// let job = setInterval(() => {
//   console.log("roop time");
// }, 1000);

fs.readFile("./sample.txt2222222", "utf-8", (err, data) => {
  //
  if (err) {
    // console.log(new Error(err));
    return;
  }
  let cnt = 0;
  let max = data.length;

  let job = setInterval(() => {
    console.clear();
    console.log(data.substring(0, cnt++));

    if (cnt == max) {
      clearInterval(job);
    }
  }, 20);
});

// setTimeout(() => {
//   clearInterval(job); // 실행되는 job을 종료
// }, 10000);
