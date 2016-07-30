var chalk = require('chalk');

const error = chalk.bold.red;
const success = chalk.bold.green;
const info = chalk.cyan;
const important = chalk.bold;

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

module.exports = {
  success: logSuccess,
  info: logInfo,
  important: logImportant,
  error: logErr,
  c: {
    error: error,
    success: success,
    info: info,
    important: important   
  }
}