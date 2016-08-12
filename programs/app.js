const program = require('commander');
const AppManager = require('../lib/commands/app');
const AppLayout = require('../lib/commands/app/layout');
const Installer = require('../lib/commands/install');
const Registry = require('../lib/commands/registry');

program
  .command('app [name] [command] [arg1] [arg2]')
  .description('Operate on an app')
  .action(function(name, command, arg1, arg2) {
    // depending on command, use another class passing the app name

    command = command ? command.toLowerCase() : 'layout';

    switch (command.toLowerCase()) {
      case 'switch': // TODO: fix
        return new Registry().write({app: {name: name}});
      case 'install':
        return new Installer().app(name).install(arg1);
      case 'layout':
        return new AppLayout(name, arg1).makeLayout();
      default:
        return new AppManager().execute(name);    
    }    
  })
