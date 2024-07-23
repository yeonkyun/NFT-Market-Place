// 라이브러리 및 모듈 선언
require('dotenv').config();
const mysql = require('mysql2');

// DB 연결 정보
const config = {
    host: process.env.DB_HOST,  // DB 호스트 주소
    port: process.env.DB_PORT,  // DB 포트
    user: process.env.DB_USER,  // DB 접속 계정
    password: process.env.DB_PASSWORD,  // DB 접속 계정 비밀번호
    database: process.env.DB_DATABASE,  // DB 이름
    connectionLimit: 10,    // DB 커넥션 풀 최대 연결 개수
};

// DB 연결(프로미스)
// 프로미스를 사용하여 비동기 처리를 하기 위해 .promise()를 사용하여 프로미스 객체를 반환
// 이후 비동기 처리를 위해 async/await를 사용하여 비동기 처리를 진행
const pool = mysql.createPool(config).promise();

// 쿼리문을 실행하는 함수
// queryDatabase 함수는 쿼리문과 파라미터를 받아 DB에 쿼리문을 실행하고 결과를 반환
const queryDatabase = async (query, params) => {
  try {
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (err) {
    throw err;
  }
};

// 모듈 내보내기
module.exports = { queryDatabase };

// 사용 예시
// const { queryDatabase } = require('./dbConnect');

// const query = 'SELECT * FROM users WHERE id = ?';
// const params = [1];

// async function example() {
//   try {
//     const result = await queryDatabase(query, params);
//     console.log(result);
//   } catch (err) {
//     console.error(err);
//   }
// }