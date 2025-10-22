const cron = require(`node-cron`);
const mysql = require("./sql");
const winston = require("winston");
// 공백으로 구분 (초, 분, 시간, 매월1일~31일, 1~12월, 0||7 and 1~6 요일)
// 매년 10월 21일 15시 20분 0초 -> cron.schedule("0 20 15 21 10 *", () => { console.log("cron job 실행", new Date()); });

const logger = winston.createLogger({
  level: "info", // error > warn > info > http > verbose > debug > silly
  // format: winston.format.printf((info) => `${info.level}: ${info.message}`),
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) => `${info.timestamp}  [${info.level}]: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "log/info.log" }),
  ],
});

customerList = async () => {
  try {
    let res = await mysql.queryExecute(
      `select count(*) as cnt from customers`,
      []
    );
    logger.info(`customers테이블의 현재건수: ${res[0].cnt}건`);
  } catch (err) {
    logger.error(err);
  }
};

// 매 분마다 customers 데이터 변경된 건수를 출력
// customers테이블의 현재건수: 9건 형식으로
//cron.schedule("*/1 * * * * *", () => {});
// cron.schedule("*/1 * * * * *", () => {
// mysql
//   .queryExecute("select count(*) as cnt from customers", [])
//   .then((response) => response[0])
//   .then((data) => {
//     console.log(`customers테이블의 현재건수: ${data.cnt}건`);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// logger.info(`level: print info level.}`);
// logger.info(`print info level.`);
// logger.error(`print error level.`);
// logger.debug(`aaa print debug level.`);
//   customerList();
// });
const rog = cron.schedule(
  "*/1 * * * * *",
  () => {
    console.log(`link start`);
  },
  { scheduled: false }
);

// app.get("/cron/start", (req, res) => {
//   rog.start();
// });
// app.get("/cron/stop", (req, res) => {
//   rog.stop();
// });
