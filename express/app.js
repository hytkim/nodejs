// nodejs > express > app.js: node를 활용하여 app.js를 실행시킬것이다
const express = require("express"); // express는 외부모듈이라, 없다면 npm install express로 설치해야한다.
const fs = require("fs");

//서버를 실행하기위해서는 서버 인스턴스(객체)를 만들어야 한다.
const app = express();

//서버 start하는방식
// app.listen(서버포트번호,콜백함수)
// 라우팅 정보: '/' -> 'page정보', '/list' ->'index.html 응답'
// get/post/put/delete 요청정보 처리결과 출력
app.listen(3000, () => {
  console.log("Server is runnig on port 3000");
});

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
  res.send("POST REQUEST TO THE HOMEPAGE");
});
