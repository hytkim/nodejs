
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dummy.txt');

console.log("===== 동기(Blocking) 방식 예제 =====");

console.log("동기: 파일 읽기 시작...");
try {
    const data = fs.readFileSync(filePath, 'utf8');
    console.log("동기: 파일 내용 ->", data);
} catch (err) {
    console.error("동기: 에러 발생!", err);
}
console.log("동기: 파일 읽기 완료. 다음 작업 실행.");

console.log("\n===== 비동기(Non-blocking) 방식 예제 =====");

console.log("비동기: 파일 읽기 시작...");
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error("비동기: 에러 발생!", err);
        return;
    }
    // 이 콜백 함수는 '비서'가 일을 끝내고 '실장'이 보고해서 실행되는 부분입니다.
    console.log("비동기: 파일 내용 ->", data);
});
console.log("비동기: 파일 읽기 완료... 가 아니라, 일단 요청만 하고 바로 다음 작업 실행!");
