let questions = {};

module.exports = questions;

const choices = require('./layouts');

questions.srcLayout = [{
    name: 'layout',
    message: 'Select your src layout:',
    type: 'list',
    choices: choices,
    default: 'simple'
  }]
