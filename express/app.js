// nodejs > express > app.js: node를 활용하여 app.js를 실행시킬것이다
const express = require("express"); // express는 외부모듈이라, 없다면 npm install express로 설치해야한다.
const fs = require("fs");
const cookieSession = require("cookie-session");
const multer = require("multer");

// 2개의 라우팅정보가있는 js파일 임포트
const productRouter = require("./routes/products");
const customerRouter = require("./routes/customer");
const boardRouter = require("./routes/board.js");

//서버를 실행하기위해서는 서버 인스턴스(객체)를 만들어야 한다.
const app = express();
// POST 요청시 body값을 파싱하기위한 미들웨어
// header / body
// 129p- body-parser설치해서쓰던기능인데 이제 익스프레스가 지원해줌
// Content-Type: "application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended: false })); // user=1234 key-value형식으로 전달되는데이터 처리
// Content-Type: "application/json"
app.use(express.json()); // { "user"="kim", "score": 90} json형식으로 전달되는데이터처리

//정적 디렉토리 설정.
app.use(express.static("public"));

// 쿠키 세션 설정
app.use(
  cookieSession({
    name: "session", // 이름 아무거나하면된다
    keys: ["asdfiaejln;iuejghp8e;o"], // 암호화를위해 사용되는값: 아무거나넣으면되는데 없으면 에러난다
    maxAge: 24 * 60 * 60 * 1000, //24 hours
  })
);

//파일 업로드(multer) 설정
const storage = multer.diskStorage({
  // 업로드된 파일이 저장될 위치 설정.
  // cb = 콜백함수
  destination: (req, file, cb) => {
    const uploadDir = "uploads/imgs/";

    // fs.mkdirSync(uploadDir, { recursive: true });
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  // 업로드될 파일의 이름을 설정. 중복파일명으로 인한 덮어쓰기 방지
  filename: (req, file, cb) => {
    // 1. 현재 시각을 이용한 고유성 확보
    const uniquePrefix = Date.now();

    // 2. originalname을 latin1로 읽어 Buffer로 만들고, 다시 utf8로 디코딩
    //    ➡️ 한글 파일명이 깨지지 않도록 처리
    const originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );

    // 3. 고유 접두사와 디코딩된 파일명을 합쳐 최종 파일명 생성
    cb(null, uniquePrefix + "-" + originalname);
    // cb(null, Date.now() + "-" + file.originalname);
  },
});
// multer 객체 생성.
const upload = multer({ storage: storage });

//get url경로: endpoint정보 하나와 실행할콜백함수 요청정보변수req, 응답처리변수res, res.send(응답정보)를하면 req요청에 대한 응답처리가 종료된다.
app.get("/", (req, res) => {
  // res.send("<h1>여기는 루트입니다.</h1>");
  fs.readFile("./root.html", "utf-8", (err, data) => {
    if (err) {
      //서버응답.status(상태정보) 서버상태에대한정보를 담을 수 있다
      res.status(500).send("Error reading file");
      return;
    }
    res.send(data);
  });
});

// form이나 fetch써야된다. url직접 때리는건 get방식이다.
app.post("/", (req, res) => {
  console.log("======================= post req =======================");
  console.log("params: ", req.params);
  console.log("headers: ", req.headers);
  console.log("body: ", req.body);
  // console.log("req: ", req);
  res.send("POST REQUEST TO THE HOMEPAGE");
});

// 파일업로드 테스트 라우팅
// 파일 하나 업로드 single, 복수파일: ary
// app.post("/upload", upload.single("profile"), (req, res) => {
app.post("/upload", upload.array("profile", 100), (req, res) => {
  // 'profile'은 form에서 업로드하는 파일의 name속성값.
  console.log(req.file);
  // console.log(req);
  res.send("파일업로드 정상화");
});
app.get("/login", (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  // res.send(`현재 ${req.session.views}번째 방문입니다.
  //   <br><a href="/logout">로그아웃</a>`);

  let form = `<br /><br /><br />
  <form action="/check" method="post">
      <input type="text" id="id" name="id" placeholder="Enter id" /><br />
      <input type="text" id="pw" name="pw" placeholder="Enter pw" />
      <input type="submit" value="로그인" />
    </form>`;
  res.send(`현재 ${req.session.views}번째 방문입니다.
    <br><a href="/logout">로그아웃</a> ${form}`);
});
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});
app.post("/check", (req, res) => {
  // console.log("req 있어요!", req);
  const { id, pw } = req.body;
  fs.readFile("user_info.txt", "utf-8", (err, data) => {
    if (err) {
      //서버응답.status(상태정보) 서버상태에대한정보를 담을 수 있다
      res.status(500).send("Error reading file");
      return;
    }
    // res.send(data);
    // let abc = data.split("\n").split(",");
    let userAry = [];
    data.split("\n").forEach((item) => {
      // console.log("날봐줘요 제발!!", item.slice(","));
      let tmp = item.split(",");
      userAry.push(tmp);
      // console.log("이것이 tmp여", tmp);
    });
    console.log(userAry);
    console.log("id", id);
    console.log("pw", pw);

    let bool = false;
    let userIndex;
    userAry.forEach((item, idx) => {
      if (!bool && item[0] == id && item[1] == pw) {
        userIndex = idx;
        bool = true;
      }
    });

    if (bool) {
      // alert(`${userAry[userIndex][2]}님 환영합니다`);
      console.log(`${userAry[userIndex][2].split("\r")[0]}}`);
      // `<script>alert("${userAry[userIndex][2]}님환영합니다.")</script>`
      return res
        .status(200)
        .send(
          `<script>alert("${
            userAry[userIndex][2].split("\r")[0]
          }님환영합니다.")</script>`
        );
      // res.send();
    } else {
      // alert("입력오류인듯? 아님말고");
      return res
        .status(400)
        .send(`<script>alert("입력 오류가 발생했습니다.")</script>`);

      // return res.status(400).send("입력 오류가 발생했습니다.");
      // res.send();
    }
    // res.redirect("/login");
  });
});

// 라우팅 정보가 너무 많을경우 파일로 나눠서 작성
// customer.js, products.js
// 얘가 이렇게 user/score보다 먼저등록되면 얘가실행된다
app.use("/products", productRouter); // '/', '/add'
app.use("/customers", customerRouter); // '/', '/add'
app.use("/boards", boardRouter);

// url호출할때 localhost:300/hongginlldong/90 에서  hongginlldong이 user 파라메터의 값,
// url패턴이 동일하면 문제가생길수있다 얘가먼저등록되면 얘가실행되고
app.post("/:user/:score", (req, res) => {
  console.log("======================= post req =======================");
  console.log("params: ", req.params);
  console.log("headers: ", req.headers);
  console.log("body: ", req.body);
  // console.log("req: ", req);
  res.send("POST REQUEST TO:user THE HOMEPAGE");
});

app.get("/test/:sno/:sname/:score", (req, res) => {
  const { sno, sname, score } = req.params;

  res.send(`
    <style>
          /* 기본적인 페이지 중앙 정렬 및 배경 스타일 */
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            display: flex; 
            flex-direction: column;
            justify-content: center; 
            align-items: center; 
            height: 90vh; 
            margin: 0; 
            background-color: #f4f4f9; 
            color: #333; 
          }
          /* 테이블 스타일 */
          table {
            width: 50%;
            max-width: 500px;
            border-collapse: collapse; /* 테두리 한 줄로 합치기 */
            box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* 은은한 그림자 효과 */
            border-radius: 8px; /* 모서리 둥글게 */
            overflow: hidden; /* 둥근 모서리 적용을 위함 */
          }
          /* 테이블 셀(칸) 스타일 */
          th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #ddd; /* 셀 하단에만 선 추가 */
          }
          /* 테이블 헤더 스타일 */
          th {
            background-color: #007bff; /* 헤더 배경색 */
            color: white; /* 헤더 글자색 */
            text-align: center;
          }
          /* 테이블 데이터 행 스타일 */
          td:first-child {
            font-weight: bold;
            background-color: #f8f9fa;
            width: 30%;
          }
          /* 마지막 줄의 하단 테두리 제거 */
          tr:last-child td {
            border-bottom: none;
          }
        </style>
    <table>
      <tbody>
      <tr><td>sno</td><td>${sno}</td></tr>
      <tr><td>sna</td><td>${sname}</td></tr>
      <tr><td>score</td><td>${
        score >= 60 ? "합격 (" + score + ")" : "불합격 (" + score + ")"
      }</td></tr>
      <tbody>
    </table>`);
});
app.post("/test", (req, res) => {
  const { sno, sname, score } = req.body;
  console.log("======================= post req =======================");
  // console.log(req);
  // console.log("params: ", req.params);
  // console.log("headers: ", req.headers);
  console.log("body: ", req.body);

  // res.send("POST REQUEST TO: TEST");
  res.send(
    `
    <style>
          /* 기본적인 페이지 중앙 정렬 및 배경 스타일 */
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            display: flex; 
            flex-direction: column;
            justify-content: center; 
            align-items: center; 
            height: 90vh; 
            margin: 0; 
            background-color: #f4f4f9; 
            color: #333; 
          }
          /* 테이블 스타일 */
          table {
            width: 50%;
            max-width: 500px;
            border-collapse: collapse; /* 테두리 한 줄로 합치기 */
            box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* 은은한 그림자 효과 */
            border-radius: 8px; /* 모서리 둥글게 */
            overflow: hidden; /* 둥근 모서리 적용을 위함 */
          }
          /* 테이블 셀(칸) 스타일 */
          th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #ddd; /* 셀 하단에만 선 추가 */
          }
          /* 테이블 헤더 스타일 */
          th {
            background-color: #007bff; /* 헤더 배경색 */
            color: white; /* 헤더 글자색 */
            text-align: center;
          }
          /* 테이블 데이터 행 스타일 */
          td:first-child {
            font-weight: bold;
            background-color: #f8f9fa;
            width: 30%;
          }
          /* 마지막 줄의 하단 테두리 제거 */
          tr:last-child td {
            border-bottom: none;
          }
        </style>
    <table>
      <tbody>
      <tr><td>sno</td><td>${sno}</td></tr>
      <tr><td>sna</td><td>${sname}</td></tr>
      <tr><td>score</td><td>${
        score >= 60 ? "합격 (" + score + ")" : "불합격 (" + score + ")"
      }</td></tr>
      <tbody>
    </table>`
  );
});

//서버 start하는방식
// app.listen(서버포트번호,콜백함수)
// 라우팅 정보: '/' -> 'page정보', '/list' ->'index.html 응답'
// get/post/put/delete 요청정보 처리결과 출력
app.listen(3000, () => {
  console.log("Server is runnig on port 3000");
});
