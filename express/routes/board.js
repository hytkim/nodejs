// nodejs > express > routes > board.js
const express = require("express");

// 라우터클래스를 활용하면 파일을 나누어서 라우팅정보를 관리할수있다.
const router = express.Router();

// 동일한 url에 다른 요청방식을 처리하는것도 가능.
// '/board' get/post/put/delete
// router
//   // .route("/")
//   .get((req, res) => {
//     res.send("Board Get");
//   })
//   .post((req, res) => {
//     res.send("Board Post");
//   })
//   .put((req, res) => {
//     res.send("Board Put");
//   })
//   .delete((req, res) => {
//     res.send("Board Delete");
//   });

router.get("/", (req, res) => {
  res.send("board Home Page");
});

router.post("/add", (req, res) => {
  //상품 등록 처리 로직 작성
  console.log(req.body);
  res.send("board Added");
});

module.exports = router;
