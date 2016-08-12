let questions = {};

module.exports = questions;
 
questions.subApps = [{
    name: 'hasSubApps',
    message: 'Does your app have multiple sub-apps?',
    type: 'confirm',
    default: false
  }]

questions.layout = [{
    name: 'layout',
    message: 'Select your app layout:',
    type: 'list',
    choices: ['complex', 'simple'],
    default: 'simple'
  }]

questions.apps = [{
    name: 'apps',
    message: 'Select your main apps:',
    type: 'checkbox',
    choices: ['user', 'guest', 'admin'], // determine from app
    default: ['user']
  }, {
    name: 'extraApps',
    message: 'List any other apps:',
    type: 'input'    
  }];

// after init, switch to 
questions.start = function(apps) {
  return [{
    name: 'appName',
    message: 'Which app are you currently working on?',
    type: 'list',
    choices: apps,
    default: 'user'
  }];
}
