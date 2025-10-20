const nodemailer = require("nodemailer");

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

// page 266
app.get("/sendmail", async (req, res) => {
  console.log(req.query);
  let result = await mysql.queryExecute(
    `select * from customers where id = ? and phone = ?`,
    [req.query.id, req.query.phone]
  );
  console.log(result);
  if (result) {
    console.log("입력 성공");
    const data = {
      from: "red_jerry7@daum.net",
      to: "red_jerry7@daum.net",
      subject: "비밀번호 재설정 이메일",
      text: "1234",
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

app.get("/sendmail", async (req, res) => {
  return new Promise(async (resolve, reject) => {
    transporter.sendMail(data, (err, info) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
});
