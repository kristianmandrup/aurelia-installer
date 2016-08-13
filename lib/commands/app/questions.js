let questions = {};

module.exports = questions;

const choices = require('./layouts');

questions.srcLayout = [{
    name: 'srcLayout',
    message: 'Select your src layout:',
    type: 'list',
    choices: choices,
    default: 'simple'
  }, {
    name: 'defaultLayout',
    message: 'Select your default app layout:',
    type: 'list',
    choices: choices,
    default: 'simple'
  }]
