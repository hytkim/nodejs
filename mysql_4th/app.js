// 패키지 임포트
const express = require("express");
const mysql = require("./sql/index");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require("cors");

// 기본 값 세팅
const url = "http://localhost:";
const app = express();
const port = 3000;
const transporter = nodemailer.createTransport({
  // Daum 메일 SMTP 서버 정보
  host: "smtp.daum.net",
  port: 465,
  secure: true, // 465번 포트는 SSL을 사용하므로 true로 설정
  auth: {
    // 본인의 Daum(또는 Hanmail) 계정 정보
    user: "red_jerry7@daum.net",
    pass: "hpfxrkekjxqipfqc", // 비밀번호 또는 앱 비밀번호
  },
});

// middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

// page 266
app.get("/sendmail", async (req, res) => {
  console.log(req.query);
  console.log(req.query.id);
  console.log(req.query.pw);
  let result = await mysql.queryExecute(
    `select * from customers where id = ? and phone = ?`,
    [req.query.id, req.query.phone]
  );
  console.log(result);
  if (result.length > 0) {
    console.log("입력 성공");
    const data = {
      from: "red_jerry7@daum.net",
      to: "red_jerry7@daum.net",
      subject: "비밀번호 재설정 이메일",
      text: "1235",
      // html: "<p>This is a test email send from <b>nodejs app using nodemailer</b></p>",
    };
    transporter.sendMail(data, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
        res.send("Email send successfully");
      }
    });
  } else {
    res.send("입력실패!");
  }
  res.send(req.query);
});

// customers table - select all
app.get("/customers", async (req, res) => {
  let result = await mysql.queryExecute("select * from customers", []);
  // console.log(result);
  res.send(result);
});

app.get("/customer/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(req.params.id);
  let result = await mysql.queryExecute(
    "select * from customers where id = ?",
    [id]
  );
  // console.log(result);
  res.send(result);
});

app.post("/customer", async (req, res) => {
  // ? ? ? ? 방식
  // console.log("req.body: ", req.body);
  // let { name, email, phone, address } = req.body;
  // queryExecute(`insert into dev.customers(name, email, phone, address) values(?, ?, ?, ?) `, [name, email, phone, address] );
  /* set ?  param 방식 */
  console.log(req.body.params);
  let result = await mysql.queryExecute(
    `insert into customers set ?`,
    req.body.params
  );
  res.send(result);
});
app.delete("/customer/:id", async (req, res) => {
  const id = req.params.id;
  let result = await mysql.queryExecute(` DELETE FROM customers WHERE id = ?`, [
    id,
  ]);
  res.send(result);
});
app.put("/customer", async (req, res) => {
  const param = req.body.params; // [{name:'test', email:'email.com'}, 6]
  console.log(req.body);
  console.log(req.body.params);

  let result = await mysql.queryExecute(
    `update customers set ? where id = ?`,
    param
  );
  res.send(result);
});

// 서버 시작
app.listen(port, () => {
  console.log(`${url}${port}`);
});
