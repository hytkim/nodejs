// nodejs > 2nd > settimeout.js: 비동기처리
// 10 -> +2 -> *2 -> +5
let result = 10;
let res = 10;

// setTimeout(() => {
//   result += 2;
// }, 500); // +2

// setTimeout(() => {
//   result *= 2;
// }, 1000); // *2

// setTimeout(() => {
//   result += 5;
// }, 800); // +5
// res => 34
// console.log(result); // result => 10, 변수선언하고 비동기함수 스택에 던져놓고 바로 콘솔까지달림

// setTimeout(() => {
//   result += 2;
//   setTimeout(() => {
//     result *= 2;
//     setTimeout(() => {
//       result += 5;
//       console.log(result);
//     }, 800); // +5
//   }, 1000); // *2
// }, 500); // +2

const promise = new Promise((resolve, resect) => {
  // 비동기방식을 동기방식으로 굴리는 예시
  setTimeout(() => {
    result += 2;
    resolve(result);
  }, 500); // +2
});

promise
  .then((resp) => {
    console.log("result", resp);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        result *= 2;
        resolve(result);
      }, 1000); // *2
    });
  })
  .then((resp) => {
    console.log("result", resp);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        result += 5;
        resolve(result);
      }, 800); // +5
    });
  })
  .then((data) => {
    console.log("result", data);
  })
  .catch((err) => {
    console.log(err);
  });

// promise를 async/await 사용해서 더 가독성좋은 코드로만들어본다.
// 함수 앞에 async 키워드가 붙어있는 경우에만 await를 사용 할 수 있다.

delayFunc = (delay, operations) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      operations(); // 1: res = 12
      resolve(res);
    }, delay); // *2
  });
};

const runPromise = async () => {
  // Promise를 반환하는 delayFunc의 처리가 완료되어 객체를 반환받을때까지 대기(await) 하겠다.
  try {
    await delayFunc(500, () => {
      res += 2;
    });
    console.log(`await1: ${res}`);

    await delayFunc(1000, () => {
      res *= 2;
    });
    console.log(`await2: ${res}`);

    await delayFunc(800, () => {
      res += 5;
    });
    console.log(`await3: ${res}`);
  } catch (err) {
    console.log(err);
  }
}; // end of ruPromise

runPromise();
