// nodejs > 2nd > todo.js
// sample.txt에서 단어의 개수(' ' 기준으로 split)가 => ?개
// 'e' 문자가 포함된 단어의 개수(include) => ?개

const fs = require("fs");

//비동기 처리 = 콜백함수
// fs.readFile("sample.txt", "utf-8", (err, data) => {
//   if (err) {
//     console.log(new Error(err));
//     return;
//   }
//   // console.log("write Done: ", data.toString());
//   let res = data.split(" ");
//   let cnt = 0;

//   res.forEach((item) => (item.includes("e") ? cnt++ : 0));

//   console.log(`smaple.txt 모든 단어의 개수: ${res.length}`);
//   console.log(`smaple.txt 'e' 가 포함된 단어의 개수: ${cnt}`);
// });

fs.readFile("sample.txt", "utf-8", (err, data) => {
  if (err) {
    console.log(new Error(err));
    return;
  }
  const search = "ea";

  let res = data.split(" ").reduce((acc, elem, idx, ary) => {
    if (idx == 0) {
      acc.total = [];
      acc.get = [];
    }
    acc.total.push(elem);
    if (elem.indexOf(search) != -1) {
      acc.get.push(elem);
    }
    return acc;
  }, {});

  console.dir(
    `전체=> ${res.total.length}, '${search}' => ${res.get.length}, [${res.get}]`
  );
});
