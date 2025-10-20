// 패키지 임포트
const express = require("express");
const mysql = require("./sql/index");

// 기본 값 세팅
const app = express();
const port = 3000;
const url = "http://localhost:";

// middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//라우팅 정보 추가
app.get("/", (req, res) => {
  res.send(`root page, Hello world!`);
});

// customers table - select all
app.get("/customers", async (req, res) => {
  let result = await mysql.queryExecute("select * from customers", []);
  // console.log(result);
  res.send(result);
});

app.get("/customer/:id", async (req, res) => {
  const id = req.params.id;
  // console.log(req.params.id);
  let result = await mysql.queryExecute(
    "select * from customers where id = ?",
    [id]
  );
  // console.log(result);
  res.send(result);
});

app.post("/customer", async (req, res) => {
  // ? ? ? ? 방식
  // console.log("req.body: ", req.body);
  // let { name, email, phone, address } = req.body;
  // queryExecute(`insert into dev.customers(name, email, phone, address) values(?, ?, ?, ?) `, [name, email, phone, address] );
  /* set ?  param 방식 */
  console.log(req.body.params);
  let result = await mysql.queryExecute(
    `insert into customers set ?`,
    req.body.params
  );
  res.send(result);
});
app.delete("/customer/:id", async (req, res) => {
  const id = req.params.id;
  let result = await mysql.queryExecute(` DELETE FROM customers WHERE id = ?`, [
    id,
  ]);
  res.send(result);
});
app.put("/customer", async (req, res) => {
  const param = req.body.params; // [{name:'test', email:'email.com'}, 6]
  console.log(req.body);
  console.log(req.body.params);

  let result = await mysql.queryExecute(
    `update customers set ? where id = ?`,
    param
  );
  res.send(result);
});

// 서버 시작
app.listen(port, () => {
  console.log(`${url}${port}`);
});
