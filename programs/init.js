const command = require('./command');
const program = require('commander'); 

program
  .command('init')
  .description('Initialize project with settings for installer')
  .action(function() {
    command.init();
  })
