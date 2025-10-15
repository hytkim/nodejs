// nodejs > 1st > reduce.js, Array.prototype.reduce();
// reduce는 첫 번째 매개변수로 acc가 하나 더 들어오는데 accs는 이전순서에서 반환되는 결과값,
// 0번째 순서의는 이전순서가 없으므로 결과값을 reduce(function(), 초기값) 의 형태로 초기값을 할당해줌
import { studentsAry, sum } from "./data.js";
// console.log("stds: ", studentsAry);
// console.log(`sum => ${sum(138, 116777)}`);

const evenAry = (acc, elem, idx, ary) => {
  console.log(`acc: ${acc}, elem: ${elem}`);
  // return이없으면 그다음순서의 acc값과, 최종적으로 reduce가 반환하는 값이: undefined가 된다.
  if (idx % 2 == 0) {
    acc.push(elem);
  }
  return acc;
};
const sumAry = (acc, elem, idx, ary) => {
  console.log(`acc: ${acc}, elem: ${elem}`);
  return acc + elem;
};
const maxAry = (acc, elem, idx, ary) => {
  console.log(
    `${idx}회차, acc: ${acc}, elem: ${elem} elem > acc ?: ${
      elem > acc ? elem : acc
    }`
  );
  return elem > acc ? elem : acc;
};
const minAry = (acc, elem, idx, ary) => {
  console.log(
    `${idx}회차, acc: ${acc}, elem: ${elem} elem < acc ?: ${
      elem < acc ? elem : acc
    }`
  );
  return elem < acc ? elem : acc;
};
const selectAry = (acc, elem, idx, ary) => {
  if (elem.score >= 60) {
    acc.push(elem);
  }
  return acc;
};
const deduplAry = (acc, elem, idx, ary) => {
  let bool = true;
  acc.forEach((item) => {
    if (item == elem) {
      bool = false;
    }
  });
  if (bool) acc.push(elem);
  return acc;
};
const deduplAry2 = (acc, elem, idx, ary) => {
  if (!acc.includes(elem)) {
    acc.push(elem);
  }
  return acc;
};
const deduplAry3 = (acc, elem, idx, ary) => {
  let exists = acc.reduce((acc2, elem2) => {
    return acc2 || elem2 == elem;
  }, false);
  if (!exists) {
    acc.push(elem);
  }
  return acc;
};
let res = [1, 2, 3, 4, 5].reduce(sumAry, 0);
console.log("sumAry", res);

res = [1, 2, 3, 4, 5].reduce(evenAry, []);
console.log("evenAry", res);

// 초기값이 있는지 없는지에 따라 reduce가 실행되는 회수가 달라진다. 초기값없으면 배열의 0, 1번째요소넣고 바로시작함
res = [23, 11, 56, 33, 47].reduce(maxAry, 0);
console.log(`최대값: ${res}`);

res = [23, 11, 56, 33, 47].reduce(minAry);
console.log(`최소값: ${res}`);

// score >= 60 ? new Array
res = studentsAry.reduce(selectAry, []);
console.log(`60점 이상`, res);
console.table(res);

const numAry = [23, 12, 45, 87, 12, 45];
res = numAry.reduce(deduplAry3, []);
console.table(res);
