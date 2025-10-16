// nodejs > 2nd > class.js: 객체를 생성할때 지켜야하는 규칙
// 현실의 실제하는 사물(Object)을 javaScript에서 정의 => Class
// class는 사물을 정의하여 속성과 기능에 대한 정보를 모아둔 도면

let obj = new Object();
obj.name = "sss";

// 도면
class Student {
  constructor(sno, sna, gra, hei, wei) {
    this.sno = sno;
    this.sna = sna;
    this.gra = gra;
    this.hei = hei;
    this.wei = wei;
  }
  showInfo = () => {
    return `${this.gra}학년 학번:${this.sno}, 이름:${this.sna}`;
  };
}

// 도면을 바탕으로 프로그램에서 실제 동작하는 무언가를 만들려면
// 인스턴스(객체)를 생성해야만 한다.
let stds = [];
let std1 = new Student(100, "람즤", 2, 165, 65);
let std2 = new Student(200, "람tt", 2, 195, 125);
stds.push(std1);
stds.push(std2);
console.table(stds);
stds.forEach((item) => console.log(item.showInfo()));
