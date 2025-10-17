// nodejs > express > routes > customer.js
const express = require("express");

// 라우터클래스를 활용하면 파일을 나누어서 라우팅정보를 관리할수있다.
const router = express.Router();

// '/': 고객정보, '/add': 고객 등록 라우팅 처리
router.get("/", (req, res) => {
  res.send("customer Home Page");
});

router.post("/add", (req, res) => {
  // 고객 등록 처리 로직 작성
  console.log(req.body);
  res.send("customer Added");
});

module.exports = router;
