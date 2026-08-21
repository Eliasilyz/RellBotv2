require("../settings");
require("./color");
require("./exif");
require("./library/menu.js");
const fs = require("fs");
const chalk = require("chalk");

global.lidToPnMap = global.lidToPnMap || {};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
 fs.unwatchFile(file);
 console.log(chalk.redBright(`Update ${__filename}`));
 delete require.cache[file];
 require(file);
});
