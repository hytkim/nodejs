// nodejs > 1st > ary.js, Array.prototype.sort();
// 함수가 객체에 소속되어있으면 메소드라고 칭한다.
"cba".split("").sort(); //  =>  ['a', 'b', 'c']

let fruits = ["banana", "apple", "mango"];
console.log(fruits.sort());

let points = [2, 14, 10, 100, 1]; // 그냥 sort()쓰면 1, 10, 100, 14, 2 ...이런식으로 정렬됨
console.log(points);
console.log(
  points.sort((a, b) => {
    console.log(`a: ${a}, b: ${b}`);
    // 오름차순: -값을 반환. a-b
    // 내림차순: +값을 반환. b-a
    // return a - b;

    if (a > b) {
      return -1;
    } else {
      return 1;
    }
  })
);

const students = [];
students.push({ sno: 100, sname: "람썬", score: 78 });
students.push({ sno: 200, sname: "람w쥐", score: 75 });
students.push({ sno: 300, sname: "썬!더쥐", score: 95 });

console.log(students);

students.sort((a, b) => {
  console.log(`a.score: ${a.score}, b.score: ${b.score}`);
  if (a.no > b.no) {
    return -1;
  } else {
    return 1;
  }
});

//filter
let res = students.filter((std) => std.score > 80);
console.log(res);

// map(function) => 매핑(A -> A'): A배열을 A'라는 다른 배열로 반환해줌 sno+sname+score => sno + sname + PASS || FAIL
res = students.map((elem) => {
  let { sno, sname, score: 창팝 } = elem;
  창팝 = elem.score > 80 ? "쌀다팜" : "소다팝";
  return { sno, sname, 창팝 };
});

// 변수의 첫번째 값이 객체이니까 해당 객체를 디스트럭처링(펼치다)해서 재구성 한다.
res = students.map(({ sno, sname, score }) => {
  let obj = {};
  obj.no = sno;
  obj.sname = sname;
  obj.pass = score > 80 ? "P" : "F";
  return obj;
});
console.log(res);
