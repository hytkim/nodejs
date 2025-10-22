const express = require("express");
const mysql = require("./sql");
const xlsx = require("./index");
const reqxlsx = require("xlsx");
const fs = require("fs");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cron = require(`node-cron`);

const app = express();
const url = "http://localhost:";
port = 3000;
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

// 전송될 데이터 형식 처리하는거
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: false })); // user=1234 key-value형식으로 전달되는데이터 처리

// 정적 디렉토리 설정
app.use(express.static("public"));

// 라우팅 정보 생성
app.get("/", (req, res) => {
  res.send("root page now");
});

//파일 업로드(multer) 설정
const storage = multer.diskStorage({
  // 업로드된 파일이 저장될 위치 설정.
  // cb = 콜백함수
  destination: (req, file, cb) => {
    const uploadDir = "files/";

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

// 멀티파트처리 => db 저장.
app.post("/upload/excels", upload.array("excelFile", 100), async (req, res) => {
  //읽어온 파일은 위에 upload.array에서 처리했고 멀티파트했으니까 이제 받아온걸로 DB슛하면됨
  await xlsx.excel_to_db(req.files[0].path);
  res.send(req.files[0].path);
});
app.get("/cron/start", (req, res) => {
  let result_text = "";
  mysql
    .queryExecute("select * from customers", [])
    .then((sqlData) => {
      sqlData.forEach((element) => {
        let { id, name, email, phone, address } = element;
        result_text += `${id}/${name}/${email}/${phone}/${address || "null"}\n`;
      });

      const data = {
        from: "red_jerry7@daum.net",
        to: "red_jerry7@daum.net",
        subject: "긴빠이 레스고",
        html: "sample content",
        text: "1235",
        attachments: [
          {
            filename: "고객정보긴빠이_info.txt",
            content: result_text,
          },
        ],
      };
      transporter.sendMail(data, (err, info) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Email 전송에 실패했습니다.");
        } else {
          console.log(info);
          return res.send("Email send successfully");
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("DB 조회 중 오류가 발생했습니다.");
    });
});

// customer table select  => excel file로 변환 => email 전송할때 첨부파일로 사용
// 'customerInfo' get
app.get("/customerInfo", (req, res) => {
  mysql
    .queryExecute("select * from customers", [])
    .then((sqlData) => {
      // console.log(sqlData);
      const workbook = reqxlsx.utils.book_new();
      // 헤더라는속성에 내가 가져온값들을 붙일수있다???
      const firstSheet = reqxlsx.utils.json_to_sheet(sqlData, {
        header: ["id", "name", "email", "phone", "address"],
      });
      reqxlsx.utils.book_append_sheet(workbook, firstSheet, "customers"); // workbook에 sheet 추가(sheet이름: "customers")

      const excelBuffer = reqxlsx.write(workbook, {
        bookType: "xlsx",
        type: "buffer",
      });

      const data = {
        from: "red_jerry7@daum.net",
        to: "red_jerry7@daum.net",
        subject: "이걸로 엑셀파일을 전송하다니 너무신기해",
        html: "sample content",
        text: "1235",
        attachments: [
          {
            filename: "customers_info.xlsx",
            content: excelBuffer,
            contentType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        ],
      };
      transporter.sendMail(data, (err, info) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Email 전송에 실패했습니다.");
        } else {
          console.log(info);
          res.send("Email send successfully");
          return res.send("Email send successfully");
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("DB 조회 중 오류가 발생했습니다.");
    });
});

app.listen(port, () => {
  console.log(`Server is runnig on ${url + port}`);
});

// 이미지 파일을 업로드하면 해당 이미지파일을 특정 경로에 저장하고, 저장된경로를가지고 db에 값을넣음.

//파일 업로드(multer) 설정
const two_storage = multer.diskStorage({
  // 업로드된 파일이 저장될 위치 설정.
  // cb = 콜백함수
  destination: (req, file, cb) => {
    const uploadDir = "upload/images";

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
    excel_file_name = uniquePrefix + "-" + originalname;
    // 3. 고유 접두사와 디코딩된 파일명을 합쳐 최종 파일명 생성
    cb(null, uniquePrefix + "-" + originalname);
    // cb(null, Date.now() + "-" + file.originalname);
  },
});
// multer 객체 생성.
const two_upload = multer({ storage: two_storage });

app.post("/upload/:productId/:type/:fileName", (req, res) => {
  // console.log("req params:",req.params);
  // console.log("req params.fileName:",req.params.fileName);
  // console.log("req. body:", req.body);
  const dir = `uploads/${req.params.productId}/${req.params.type}`;
  const filePath = `${dir}/${req.params.fileName}`;
  console.log("req.params.productId: ", req.params.productId);
  console.log("req.params.type: ", req.params.type);
  console.log("filePath: ", filePath);
  const base64Data = req.body.imagebase64.split(";base64,").pop();
  // console.log(base64Data); 정상출력 확인.

  try {
    // 1. (수정) 디렉토리가 없으면 생성합니다.
    // { recursive: true } 옵션은 'uploads/100/1' 처럼 중첩된 경로도 한 번에 생성해줍니다.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`디렉토리 생성: ${dir}`);
    }

    // 2. (수정) 파일 쓰기 및 응답 처리를 콜백 내에서 완료
    fs.writeFile(filePath, base64Data, "base64", (err) => {
      if (err) {
        console.log(err);
        // 3. (수정) 에러 발생 시 여기서 응답하고 함수 종료
        return res.status(500).send("파일 저장 중 오류가 발생했습니다.");
      }

      // 4. (수정) 성공 시 콜백 안에서 응답
      console.log(`파일 저장 완료: ${filePath}`);
      res.send({
        message: "파일이 성공적으로 업로드되었습니다.",
        path: filePath,
      });
    });
  } catch (error) {
    // fs.mkdirSync 등 동기 코드에서 발생할 수 있는 오류 처리
    console.error("디렉토리 생성 또는 파일 쓰기 시도 중 오류:", error);
    res.status(500).send("서버 처리 중 오류가 발생했습니다.");
  }
});

// fs.writeFile(filePath, base64Data, "base64", (err) => {
//   if (err) {
//     console.log(err);
//     return res.status(500).send("오류");
//   }
// });

const rog = cron.schedule(
  "*/1 * * * * *",
  () => {
    console.log(`link start`);
  },
  { scheduled: false }
);
rog.stop();
app.get("/cron/start", (req, res) => {
  rog.start();
});
app.get("/cron/stop", (req, res) => {
  rog.stop();
});

a = () => {
  let result_text = "";
  mysql
    .queryExecute("select id,name,email,phone,address cnt from customers", [])
    .then((response) => response)
    .then((data) => {
      // console.log(`data: `, data);
      data.forEach((element) => {
        let { id, name, email, phone, address } = element;
        result_text += `${id}/${name}/${email}/${phone}/${
          !address ? "null" : address
        }\n`;
      });
      console.log(result_text);
    })
    .catch((err) => {
      console.log(err);
    });
};
