// 패키지 임포트
const express = require("express");
const mysql = require("./sql/index");
const cors = require("cors");

// 기본 값 세팅
const url = "http://localhost:";
const app = express();
const port = 3000;

app.use(express.json()); // post로전송할때 json형식으로 통신하려면 필요
app.use(express.urlencoded({ extended: true })); // url에다가 값넣어서 통신하려면 필요
app.use(cors()); // 서로 다른 port일때 호환하려면 이거써야됨

// 정적디렉토리 설정
app.use(express.static("public"));

app.post("/signup", async (req, res) => {
  let {
    name,
    email,
    phone,
    password: password_hash,
    password: password_salt,
  } = req.body;
  password_salt = crypto.randomBytes(64).toString("base64");
  // const dbPass =
  //   "a98xbPPYoiSp5b6xM05TJzcQX76tQwd5q7QYNsqkcGXSmhkTR47ikaS6KVMo7c9PzenM/VP2I6h0c/RDWCdr6g==";
  console.log(password_salt);

  // password이라는 매개변수로 받은 비밀번호 평문에, salt를 쓰까서,  암호화 100000만번 반복한 결과를 뱉는다, 64byte 크기로, sha512 알고리즘을 사용하여 암호를 만든다
  await new Promise((resolve, resect) => {
    crypto.pbkdf2(
      req.body.password,
      password_salt,
      100000,
      64,
      "sha512",
      (err, key) => {
        if (err) {
          console.log(err);
          resect(err);
          return;
        }
        password_hash = key.toString("base64");
        console.log("success key: ", key.toString("base64"));
        resolve(true);
      }
    );
  });

  const customer_data = { name, email, phone, password_hash, password_salt };
  console.log(customer_data);

  let result = await mysql.queryExecute(
    `insert into customers set ?`,
    customer_data
  );
  console.log(result);

  res.send("회원가입 성공");
});

app.post("/signin", async (req, res) => {
  let { emailin: email, passwordin: password } = req.body;
  const signinData = { email, password };
  console.log(signinData);

  let result = await mysql.queryExecute(
    "select password_hash, password_salt from customers where email = ?",
    [signinData.email]
  );
  console.log("SQL Execute: ", result);
  console.log("SQL Execute: ", result[0].password_hash);
  console.log("SQL Execute: ", result[0].password_salt);

  let bool = await new Promise((resolve, resect) => {
    crypto.pbkdf2(
      signinData.password,
      result[0].password_salt,
      100000,
      64,
      "sha512",
      (err, key) => {
        if (err) {
          console.log(err);
          resect(err);
          return;
        }
        resolve(result[0].password_hash == key.toString("base64"));
      }
    );
  });

  if (bool) {
    // res.send("로긴각이네 로긴각");
    res.send(
      `<script>alert('로그인 성공 했습니다.'); history.back();</script>`
    );
  } else {
    // res.send("다시해라 애송이");
    res.send(
      `<script>alert('로그인 실패 했습니다.'); history.back();</script>`
    );
  }
});

//라우팅 정보 추가
app.get("/", (req, res) => {
  res.send(`root page, Hello world!`);
});

//-- DB + Express => localhost:3000/boards(GET) 로 조회
// tbl_board table - select all
app.get("/boards", async (req, res) => {
  let result = await mysql.queryExecute("select * from tbl_board", []);
  // console.log(result);
  res.send(result);
});

// localhost:3000/board/:id (GET) 조회
app.get("/board/:id", async (req, res) => {
  const id = req.params.id;
  console.log("req.params.id is:", req.params.id);
  let result = await mysql.queryExecute(
    "select * from tbl_board where id = ?",
    [id]
  );
  // console.log(result);
  res.send(result);
});

// localhost:3000/board (POST) 등록
// 주의점: (title, content, writer) is Not Null
app.post("/board", async (req, res) => {
  console.log("req is: ", req);
  console.log("req body is: ", req.body);
  console.log("post req.body.params: ", req.body.params);
  let result = await mysql.queryExecute(
    `insert into tbl_board set ?`,
    req.body.params
  );
  res.send(result);
});

app.put("/board", async (req, res) => {
  const { id, ...param } = req.body.params; // [{name:'test', email:'email.com'}, 6]
  console.log("req.body.params: ", req.body.params);
  console.log("id: ", id);
  console.log("param is ", param);

  let result = await mysql.queryExecute(`update tbl_board set ? where id = ?`, [
    param,
    id,
  ]);
  res.send(result);
});
app.delete("/board/:id", async (req, res) => {
  const id = req.params.id;
  console.log("req body is: ", req.body);
  let result = await mysql.queryExecute(` DELETE FROM tbl_board WHERE id = ?`, [
    id,
  ]);
  res.send(result);
});

// 서버 시작
app.listen(port, () => {
  console.log(`${url}${port}`);
});
