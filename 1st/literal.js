//nodejs > 1st > literal.js
import { getStudentInfo } from "./data.js";

let n = `ssal da Fam`;
// console.log(`Hello, ${n}`);

// 백틱으로 간단한연산도 가능
let n1 = 10;
let n2 = 11;
// console.log(`n1 + n2 = ${n1 + n2}`);

// console.log(
//   `${getStudentInfo()
//     .map((item) => "\n 이름:" + item)
//     .join(" ")}`
// );

//spread operator
let friends = ["허리", "통증", "척추", "측만증"];
// console.log(...friends);
let nium = [...friends, ...getStudentInfo()];
// nium = [friends, getStudentInfo()];
// console.log(nium);

// Object Destructuring
const person = {
  fn: "Kill",
  ln: "You",
  age: 181818181818,
};
let { fn: a, ln: b, age: c } = person;
// console.log({ a, b, c });

// Array Destructuring
let [a1, a2, ...a3] = getStudentInfo();
console.log(a1, a2, a3);
