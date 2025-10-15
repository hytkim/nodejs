// nodejs > 1st > data.js, module 기능. : 다른 js에서 참조가능한 객체,함수를 지정해서 export할수있음, 살짝 접근제한자 조상님같은개념인듯
const studentsAry = [
  { sno: 100, sname: "람썬", score: 80 },
  { sno: 200, sname: "람w쥐", score: 57 },
  { sno: 300, sname: "썬!더쥐", score: 77 },
  { sno: 400, sname: "쥐g쥐", score: 92 },
];

const sum = (a, b) => a + b;

const PI = 3.14;

export { studentsAry, sum, PI };

getStudentInfo = () => {
  return ["rmaG", "TETO-Nam", "e-GenNam", "TT"];
};
