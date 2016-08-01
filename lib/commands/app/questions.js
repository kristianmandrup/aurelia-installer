let questions = {};

module.exports = questions;
 
questions.apps = [{
    name: 'apps',
    message: 'Which app layout do you prefer?',
    type: 'list',
    choices: ['single', 'multi'],
    default: ['single']
  }, {
    name: 'apps',
    message: 'What are your main apps?',
    type: 'list',
    choices: ['user', 'guest', 'admin'], // determine from app
    default: ['user']
  }, {
    name: 'customApps',
    message: 'Any other apps?',
  }];

// after init, switch to 
questions.start = [{
    name: 'appName',
    message: 'Which app are you currently working on?',
    type: 'list',
    choices: ['user', 'guest'], // determine from apps available
    default: 'user'
  }]
