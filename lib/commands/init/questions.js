const jsonfile = require('jsonfile')
const fs = require('fs')

function detectFile(filePath) {
  try {
    if (fs.statSync(filePath).isFile()) {
      return true;    
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    }
    console.error(`Error checking for ${filePath} file in project`, e)
  } 
}

const defaults = {
  webpack: detectFile('./webpack.config.js'),
  jspm: detectFile('./config.js'),
}

// assume webpack if not jspm
defaults.pref = function() {
  return defaults.jspm ? 'jspm' : 'webpack';
}();

let questions = {};

module.exports = questions;
 
questions.init = [{
  name: 'packageManager',
  message: 'Which is your preferred package manager?',
  type: 'list',
  choices: ['webpack', 'jspm'],
  default: defaults.pref
  }, {
    name: 'gitAccount',
    message: 'What is your preferred git account for installing components in this project?'
  }];

