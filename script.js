const pkjs = require("./package.json");
const fs = require("fs");
const split_version = pkjs.version.split(".");
let last_number_of_version = parseInt(split_version[split_version.length - 1]);

last_number_of_version++;

pkjs.version = pkjs.version.substring(0, 4) + last_number_of_version;

fs.writeFileSync("./package.json", JSON.stringify(pkjs));

console.log("Upgrade to " + pkjs.version);
