const program = require('commander');
const AppManager = require('../lib/commands/app');
const Installer = require('../lib/commands/install');

program
  .command('app <name> [command] [arg1] [arg2]')
  .description('Operate on an app')
  .action(function(name, command, arg1, arg2) {
    // depending on command, use another class passing the app name

    command = command ? command.toLowerCase() : 'layout';

    switch (command.toLowerCase()) {
      case 'switch':
        process.env.AURELIA_APP = arg1 || defaults.app;
      case 'install':
        new Installer().app(name).install(arg1);
      default:
        new AppManager().execute(name);    
    }    
  })
