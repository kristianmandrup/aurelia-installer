var chalk = require('chalk');

const error = chalk.bold.red;
const success = chalk.bold.green;
const info = chalk.cyan;
const important = chalk.bold;
const warn = chalk.yellow;

function logSuccess(...rest) {
  console.log(success(...rest));
}

function logInfo(...rest) {
  console.log(info(...rest));
}

function logImportant(...rest) {
  console.log(important(...rest));
}

function logErr(...rest) {
  console.log(error(...rest));
}

function logWarn(...rest) {
  console.log(warn(...rest));
}


module.exports = {
  success: logSuccess,
  info: logInfo,
  warn: logWarn,
  important: logImportant,
  error: logErr,
  c: {
    error: error,
    success: success,
    warn: warn,
    info: info,
    important: important   
  }
}