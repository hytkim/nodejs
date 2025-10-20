const mysql = require("mysql2/promise");

// mysql connection setup
const dbConfig = {
  host: "localhost", // 혹은 본인 ip
  user: "dev01",
  password: "dev01",
  database: "dev",
  port: 3306, // mySql 설정할때 있었던 3306포트번호
  connectionLimit: 10, // DB를 사용하려면 커넥션 정보를 사용해야한다. 필요할때마다 연결하는게아니라 한번에 연결10개를 땡겨와서 쓴다. 이거쓰면 쿼리쓸때 연결해제하는코드 꼭 넣어줘야한다.
};

// create the connection pool: setup한 dbConfig의 정보를 바탕으로 실제DB서버와 연결을 생성한다.
const pool = mysql.createPool(dbConfig);

// 쿼리 함수 1
/*
queryExecute = (sql, params) => {
  // 풀이 가지고있는 DB정보(DBConfig)를 가지고 DB에 접속을 갈긴다.
  // 접속결과를 가져와서 then에서 쿼리를 실행한다.
  let connection;
  console.log("execute sql:", sql);
  console.log("execute params: ", params);
  return pool
    .getConnection()
    .then((conn) => {
      connection = conn;
      // return conn.execute(sql, params);
      return conn.query(sql, params);
    }) // connection의 실행결과가 첫번째 배열에 필드정보, 두번째 배열에 스키마정보를 가져온다.
    .then((result, val) => {
      console.log("result: ", result);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      // 사용한 커넥션을 반환해준다.
      if (connection) connection.release(); // release to pool 안해주면 나중에 커넥션에 접속이안됨.
    });
};
*/
queryExecute = (sql, params) => {
  let connection;

  return new Promise(async (resolve, reject) => {
    try {
      let conn = await pool.getConnection();
      connection = conn;
      const [rows, fields] = await connection.query(sql, params);
      resolve(rows);
    } catch (err) {
      reject(err);
    } finally {
      if (connection) connection.release();
    }
  });
};

module.exports = { queryExecute };
