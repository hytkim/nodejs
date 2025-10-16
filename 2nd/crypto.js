// nodejs > 2nd > crypto.js
const crypto = require("crypto");

// sha256 방식으로 암호화를 할거다. || sha256 알고리즘을 쓸꺼다.
// 암호화 할 문장은 sample123 이다.
// 암호의 인코딩 방식은 hex 이다.
let pwd1 = crypto.createHash("sha256").update("sample123").digest("hex");
let pwd2 = crypto.createHash("sha256").update("sample123").digest("base64");

// 항상 똑같은 결과: 다스보옳 다스부츠? woo ya
// console.log(pwd1);
// console.log(pwd2);

//1. DB의 값을 암호화값 vs. 사용자가 입력한 값 암호화값 => 비교후 판별

// (err, key) => {} 콜백이 있는 비동기 pbkdf2 함수는 Promise를 쓰지않으면 암호화된 키가 만들어지기전에 return key가 실행되어서 오류난다.
getCryptoPassword = async (password) => {
  // salting 임의 구문을 생성 => 동일한 평문에 쓰까서 => 다른 암호값을 만듦.
  //crypto.randomBytes(64).toString("base64");
  const dbPass =
    "a98xbPPYoiSp5b6xM05TJzcQX76tQwd5q7QYNsqkcGXSmhkTR47ikaS6KVMo7c9PzenM/VP2I6h0c/RDWCdr6g==";

  let salt =
    "pYp81zNsG9ZYmYZvFuppG9MDElklfeGwMbiPGwHUGqBToItqBJw/VZ8ItgBoZLu+ofWTG/dzP3TBw6FijHSO5w==";
  // console.log(salt);

  // password이라는 매개변수로 받은 비밀번호 평문에, salt를 쓰까서,  암호화 100000만번 반복한 결과를 뱉는다, 64byte 크기로, sha512 알고리즘을 사용하여 암호를 만든다
  return new Promise((resolve, resect) => {
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, key) => {
      if (err) {
        // console.log(err);
        resect(err);
        return;
      }
      // console.log("success key: ", key.toString("base64"));
      resolve(dbPass == key.toString("base64"));
    });
  });
};

getCryptoPassword("sample123")
  .then((data) => {
    console.log("data: \n", data);
  })
  .catch((err) => console.log(err));
