const mysql = require("./sql");
const express = require("express");
const xlsx = require("xlsx");

// db table 읽어온 결과값으로 exel 워크북에 시트 만들어서 저장
db_to_excel = () => {
  // Promise 반환이니까 then을쓰는거였구나 시발...
  mysql
    .queryExecute("select id, name, email, phone, address from customers", [])
    .then((result) => {
      console.log(result); //DB에서 sql읽어서 반환받은 Promise값들, 이 값을 엑셀파일의 데이터로 사용할것이다.
      //워크북 생성 -> sheet 추가 -> 파일 저장
      const workbook = xlsx.utils.book_new();
      // 헤더라는속성에 내가 가져온값들을 붙일수있다???
      const firstSheet = xlsx.utils.json_to_sheet(result, {
        header: ["id", "name", "email", "phone", "address"],
      });

      xlsx.utils.book_append_sheet(workbook, firstSheet, "customers"); // workbook에 sheet 추가(sheet이름: "customers")
      xlsx.writeFile(workbook, "./files/customers.xlsx"); // 파일 저장
    })
    .catch((err) => {
      console.log(err);
    });
};

// exel 워크북의 시트를 읽어온 값을 db 테이블에 insert
// excel_to_db = () => {
//   const workbook = xlsx.readFile("./files/customers.xlsx");
//   const firstSheetName = workbook.SheetNames[0]; // 첫 번째 시트 이름
//   const firstSheet = workbook.Sheets[firstSheetName]; // 첫번째 시트를 워크북의 시트s객체에 시트이름속성으로 가져온다.
//   const excelData = xlsx.utils.sheet_to_json(firstSheet); //읽어온 시트 객체를 sheet_to_json을 통해 javaScript 객체로 바꿔준다.
//   // console.log(excelData);
//   excelData.forEach(async (item) => {
//     await console.log(item);
//     mysql
//       .queryExecute("insert into customers set ?", item)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => console.log(err));
//   });
// };

excel_to_db = (filename) => {
  const workbook = xlsx.readFile(`./files/${filename}`);
  const firstSheetName = workbook.SheetNames[0]; // 첫 번째 시트 이름
  const firstSheet = workbook.Sheets[firstSheetName]; // 첫번째 시트를 워크북의 시트s객체에 시트이름속성으로 가져온다.
  const excelData = xlsx.utils.sheet_to_json(firstSheet); //읽어온 시트 객체를 sheet_to_json을 통해 javaScript 객체로 바꿔준다.
  // console.log(excelData);
  excelData.forEach(async (item) => {
    await console.log(item);
    mysql
      .queryExecute("insert into customers set ?", item)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  });
};
module.exports = { excel_to_db, db_to_excel };
