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
  pref: {    
  }
}

// assume webpack if not jspm
defaults.pref.bundler = function() {
  return defaults.jspm ? 'systemjs' : 'webpack';
}();

defaults.pref.packageMan = function() {
  return defaults.jspm ? 'jspm' : 'npm';
}();


let questions = {};

module.exports = questions;
 
questions.init = [{
  name: 'appBundler',
  message: 'Select your application bundler:',
  type: 'list',
  choices: ['webpack', 'systemjs'],
  default: defaults.pref.bundler
  }, {
  name: 'packageManager',
  message: 'Select your package/dependency manager:',
  type: 'list',
  choices: ['npm', 'jspm'],
  default: defaults.pref.packageMan
  }, {
    name: 'gitAccount',
    message: 'What is your preferred git account for installing components in this project (for github simply write account name)?'
  }, {
    name: 'componentsPath',
    message: 'What will be your is default components folder of your app?',
    type: 'input',
    default: 'components'    
  }];

