const exec = require("child_process").execSync;
exec("g++ -std=c++11 -O2 gcctest.cpp -o gcctest.out");
console.log('compile complete!!');
var result = exec("./gcctest.out");
exec("rm gcctest.out");

// convert and show the output.
console.log(result.toString("utf8"));
