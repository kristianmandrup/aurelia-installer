const program = require('commander');
const AppManager = require('../lib/commands/app');
const AppLayout = require('../lib/commands/app/app-layout'); 
const Installer = require('../lib/commands/install');
const Registry = require('../lib/commands/registry');
const log = require('../lib/commands/log');
const c = log.c;

program
  // app layout - create full app layout for app config
  // app layout guest - create app layout for guest app using guest layout spec or default app layout if no guest
  // app layout login guest - create app layout for login app using gust app layout spec

  .command('app [command] [name] [layout]')
  .description('Operate on an app')
  .action(function(command, name, arg1, arg2) {
    // depending on command, use another class passing the app name

    command = command ? command.toLowerCase() : 'config';

    switch (command.toLowerCase()) {
      case 'switch':
        return new Registry().write({currentApp: name});
      case 'layout':
        return new AppLayout(name, layout).generate();      
      case 'config':
        return new AppManager().execute(name);    
      default:
        log.error('Unknown app command, use either: switch, layout or config');
    }    
  })
