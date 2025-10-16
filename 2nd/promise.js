// nodejs > 2nd > promise.js
// promise객체의 상태 3종 => pending:요청(처리,초기화) / fulfilled:정상완료 / rejected: 요청거부
// promise객체의 내장기능(Methode) => then() / catch()

// 프로미스객체는 성공했을때 동작할 함수: resolve, 실패했을때 동작할 함수: reject 를 매개변수로 받는다.
// 비동기방식의 코드를 동기방식으로 사용하기위함
const promise = new Promise((resolve, reject) => {
  // 정상완료 => 첫번째 매개값으로 받은 함수 호출: resolve
  // 거부=> 두번째 매개값으로 받은 함수 호출: reject
  try {
    // console.logs("hhhh");
    setTimeout(function () {
      // promise의 then 메서드에 선언한 함수의 매개값으로  Success를 전달.
      resolve({
        retCode: "Success",
        retVal: ["람지", "썬더", "만죠메", "창팝"],
      });
    }, 1000);
  } catch (err) {
    reject(new Error("Line 20 Error !!!"));
  }
});

promise
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  }); // then이 반환하는 반환타입이 promise라서 메소드 체인을 사용가능하다

fetch("")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
