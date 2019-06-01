const exec = require("child_process").execSync;

exec("g++ -std=c++11 -O2 gcctest.cpp -o exp_output.out");
var result = exec("./exp_output.out");

// convert and show the output.
console.log(result.toString("utf8"));
