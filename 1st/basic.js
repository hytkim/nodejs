console.log("node start");

// let 과 var 키워드 차이
let times = 3;
// var times = 3;

// let times = 4;
// var times = 4;

// const(상수)
const PI = 3.14;
// PI = 18; // 에러 발생constant variable.

// 지역변수(블럭레벨)
{
  let times = 4;
  console.log(times);
}
// 전역변수
console.log(times);

// 객체할당
const obj = {};
// obj = { age: 10 };// 상수객체니까 새로운값을 할당할수는없지만
obj.age = 10; // 할당된 객체의 속성은 추가/변경이 가능하다.
console.log(obj);

// 함수 선언에는 2가지방법이 있다: 1. 함수정의, 2. 함수표현
// 함수 정의와 함수 표현은 달라보이지만 사실 내부적으로는 동일한 선언이므로 주의해야한다.

// 1. 함수정의
// function sum(n1 = 0, n2 = 0) {
//   return n1 + n2;
// }

// 2. 함수 표현
//  'sum' has already 이미 1. 에서 정의된거 다시선언했기때문에 오류남
// const sum = function (n1 = 0, n2 = 0) {
//   return n1 + n2;
// };

// 함수 표현식을 사용할 때 화살표를 써서 간략화 할수있다.
const sum = (n1 = 0, n2 = 0) => n1 + n2;

console.log(`sum(1, 2)의 결과: ${sum(1, 2)}`);
