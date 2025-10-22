// 패키지 임포트
const express = require("express");
const mysql = require("./sql/index");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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

// 정적디렉토리 설정
app.use(express.static("public"));

//라우팅 정보 추가
app.get("/", (req, res) => {
  res.send(`root page, Hello world!`);
});

mailsend = () => {
  const data = {
    from: "red_jerry7@daum.net",
    to: "red_jerry7@daum.net",
    subject: "수업진짜 너무 따라가기힘들다 나는 바보멍청이야",
    html: "sample content",
    text: "1235",
    attachments: [
      {
        filename: "customers.txt",
        path: "./files/customers.xlsx",
      },
    ],
  };
  transporter.sendMail(data, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
      res.send("Email send successfully");
    }
  });
};

// 서버 시작
app.listen(port, () => {
  console.log(`${url}${port}`);
});

mailsend();
