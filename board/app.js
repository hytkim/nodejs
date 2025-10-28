// 패키지 임포트
const express = require("express");
const mysql = require("./sql/index");
const cors = require("cors");
const crypto = require("crypto"); // ❗ 이 줄을 추가하세요

// 기본 값 세팅
// const url = "http://localhost:";
const url = "http:192.168.0.15:";
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
    // "select password_hash, password_salt from customers where email = ?",
    "select id, password_hash, password_salt from customers where email = ?",
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
    // res.send(`<script>alert('로그인 성공 했습니다.'); history.back();</script>`);
    // res.json({ success: true, user: result[0] });
    let safeUserResult = await mysql.queryExecute(
      "select id, name, email, phone, address, isAdmin from customers where id = ?",
      [result[0].id] // 검증된 사용자의 id
    );

    // ❗ [핵심 추가] 조회한 결과를 '반드시' res.json()으로 응답해야 합니다.
    res.json({ success: true, user: safeUserResult[0] });
  } else {
    // res.send("다시해라 애송이");
    // res.send(`<script>alert('로그인 실패 했습니다.'); history.back();</script>`);
    res.json({ success: false, message: "비밀번호가 틀렸습니다." });
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

// 1. (R) 특정 게시글의 모든 댓글 조회 (GET /board/:id/replies)
app.get("/board/:id/replies", async (req, res) => {
  const board_id = req.params.id; // ❗ 게시글의 id

  try {
    let result = await mysql.queryExecute(
      "SELECT * FROM tbl_reply WHERE board_id = ?",
      [board_id]
    );
    res.json(result); // 조회된 댓글 배열 반환
  } catch (err) {
    console.error("댓글 조회 실패:", err);
    res.status(500).json({ message: "댓글 조회 중 오류 발생" });
  }
});

// 2. (C) 새 댓글 작성 (POST /reply)
app.post("/reply", async (req, res) => {
  // ❗ 프론트에서 { content, board_id, writer }를 params로 보내야 함
  const replyData = req.body.params;
  console.log("새 댓글 데이터:", replyData);

  try {
    let result = await mysql.queryExecute(
      "INSERT INTO tbl_reply SET ?",
      replyData
    );
    res.json(result); // OkPacket (insertId 포함) 반환
  } catch (err) {
    console.error("댓글 작성 실패:", err);
    res.status(500).json({ message: "댓글 작성 중 오류 발생" });
  }
});

// 3. 댓글 수정 기능
app.put("/reply", async (req, res) => {
  const { id, ...parmas } = req.body;

  try {
    let result = await mysql.queryExecute(
      "UPDATE tbl_reply SET ? where id = ?",
      [parmas, id]
    );
    res.json({ message: "성공적으로 댓글이 수정되었습니다." });
  } catch (err) {
    console.error("삭제 실패: ", err);
    return res.status(500).json({ message: "댓글 수정 중 오류 발생" });
  }
});

// 4. 댓글 삭제 기능
app.delete("/reply/:id", async (req, res) => {
  const reply_id = req.params.id;
  const { id, writer } = req.body;
  if (reply_id != id) {
    // 400 Bad Request: 클라이언트가 데이터를 잘못 보냄
    return res.status(400).json({ message: "id 정보가 일치하지 않습니다." });
  }

  try {
    let result = await mysql.queryExecute(
      "DELETE FROM tbl_reply WHERE id = ? AND writer = ?",
      [id, writer]
    );
    res.json({ message: "성공적으로 댓글이 삭제되었습니다." });
  } catch (err) {
    console.error("삭제 실패: ", err);
    return res.status(500).json({ message: "댓글 삭제 중 오류 발생" });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`${url}${port}`);
});
