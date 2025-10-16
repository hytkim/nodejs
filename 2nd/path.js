// nodejs > 2nd > path.js

const process = require("process");
const os = require("os");
const path = require("path");
const url = require("url");

// console.log(process.env.username); // admin
// process.exit(); // 프로그램 강제로 종료하겠다
// console.log(os.arch()); // x64
// console.log("cpus: \n", os.cpus());// i7-core: [0~7]
// console.log(os.hostname()); // Desktop-p1ttng7
// console.log(os.networkInterfaces());
console.log(os.type());
console.log(os.platform());
console.log(os.release());
console.log(os.homedir());
console.log(os.tmpdir());
console.log(os.totalmem());
console.log(os.freemem());

console.log(`============== PATH ==============`);

// 경로 반환
console.log(__filename);
console.log(path.basename(__filename));
console.log(path.basename(__filename, ".js"));

console.log(`-------- delimiter --------`);
// 환경변수 구분자
console.log(path.delimiter, "\n");
console.log(process.env.path, "\n");
console.log(process.env.path.split(path.delimiter));

// dirname: 현재 내 파일이 위치한 디렉토리
console.log(__filename);
console.log(path.dirname(__filename));

// extname: 확장자
console.log(path.extname("index.html"));

//format
path.format({
  root: "/ignored",
  dir: "/home/user/dir", // dir값으로 root 무시
  base: "file.txt",
}); // '/home/user/dir/file.txt'

path.format({
  root: "/",
  base: "file.txt",
  ext: "ignored", // base 값으로 ext 무시
}); // '/file.txt'

path.format({
  root: "/",
  name: "file",
  ext: ".txt",
}); // '/file.txt'

//경로 절대성 검사
console.log(path.isAbsolute(__filename));
console.log(path.isAbsolute(path.dirname(__filename)));

// 입력한 매개변수를 합쳐서 경로값으로 반환
console.log(path.join("/foo", "bar", "baz/asdf")); // '\foo\bar\baz\asdf'

// 입력한 경로값을 역으로 반환
console.log(path.parse("/home/user/dir/file.txt"));

console.log(path.sep);

console.log(`============== 91p. WHATWG APT ==============`);

const myURL = new URL(
  "https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash"
);
console.log(myURL);

const myURL2 = new URL("https://example.org/foo#bar");
console.log(myURL2);

const myURL3 = new URL("https://example.org/?user=abc&query=xyz");
console.log(myURL3.searchParams.get("user"));
console.log(myURL3.searchParams.has("user"));
console.log(myURL3.searchParams.keys());
console.log(myURL3.searchParams.values());
myURL3.searchParams.append("user", "admin");

console.log(myURL3.searchParams.getAll("user"));
myURL3.searchParams.set("user", "admin");
myURL3.searchParams.delete("user", "admin");
console.log(myURL3.searchParams.toString());

console.log(`============== 레거시 API ==============`);

console.log(
  url.parse("https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash")
);

// 아 이거아니였???음 크악
console.log(`============== 94p. Crypto ==============`);

const crypto = require("crypto");

console.log(crypto.createHash("sha512").update("pw1234").digest("base64"));
console.log(crypto.createHash("sha512").update("pw1234").digest("hex"));

const createSalt = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) reject(err);
      resolve(buf.toString("base64"));
    });
  });
};

const createCryptoPassworld = async (plainPassword) => {
  const salt = await createSalt();

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(plainPassword, salt, 100000, 64, "sha512", (err, key) => {
      if (err) reject(err);
      resolve({ password: key.toString("base64"), salt });
    });
  });
};

const getCryptoPassworld = (plainPassword, salt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(plainPassword, salt, 9999, 64, "sha512", (err, key) => {
      if (err) reject(err);
      resolve({ password: key.toString("base64"), salt });
    });
  });
};
