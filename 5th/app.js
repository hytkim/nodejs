const express = require("express");
const mysql = require("./sql");
const xlsx = require("./index");
const fs = require("fs");
const multer = require("multer");

const app = express();
const url = "http://localhost:";
port = 3000;

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
