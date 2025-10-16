// nodejs > 2nd > console_class.js
const { Console } = require("console");
const fs = require("fs");

const output = fs.createWriteStream("./stdout.log", { flags: "a" }); // 일반로그.
const errOuntput = fs.createWriteStream("./stderr.log", { flags: "a" }); // 에러로그.

const logger = new Console({ stdout: output, stderr: errOuntput });
//logger
logger.log("Prints to stdout with newline \n");
logger.error("Standard I/O Error!!! \n");
