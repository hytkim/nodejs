const { PI, sum } = require("./module.js");
const fs = require("fs"); // node 내장모듈. File System

// 마지막 매개값은 처리가 완료되면 호출되는 callBack 함수, 매개값이 정해져있음
// wirteFile은 비동기처리 => 가 완료되면 callBack 함수
// fs.writeFile("sample.txt", "content wirte: hello world", (err) => {
//   if (err) {
//     console.log(new Error(err));
//   }
//   console.log("write Done!!");
// });

//그러면 동기처리를해주는함수도있겠지
// fs.writeFileSync(
//   "sample2.txt",
//   "얘는 동기처리기때문에 콜백함수가없고 유니코드지정이있음",
//   "utf-8"
// );

//비동기 처리 = 콜백함수
fs.readFile("sample.txt", "utf-8", (err, data) => {
  if (err) {
    console.log(new Error(err));
    return;
  }
  console.log("write Done: ", data.toString());
});

// 동기 처리
let data = fs.readFileSync("sample2.txt", "utf-8");
console.log(data);

console.log(sum(PI, PI));
// console.log(fs);
