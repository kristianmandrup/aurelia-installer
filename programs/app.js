const program = require('commander');
const AppManager = require('../lib/commands/app');
const AppLayout = require('../lib/commands/app/app-layout'); 
const Installer = require('../lib/commands/install');
const Registry = require('../lib/commands/registry');
const log = require('../lib/commands/log');
const c = log.c;
const commitCmd = require('../lib/command');

function appLayout(name) {
  new AppLayout(name, layout).generate();
}

function appSrcLayout() {
  new AppManager().execute();
}

function switchApp(name) {
  return new Registry().write({currentApp: name});
}

const noop = () => {  };

program
  // app layout - create full app layout for app config
  // app layout guest - create app layout for guest app using guest layout spec or default app layout if no guest
  // app layout login guest - create app layout for login app using gust app layout spec

  .command('app [command] [name] [layout]')
  .description('Operate on an app')
  .action(function(command, name, layout) {
    // depending on command, use another class passing the app name

    switch (command.toLowerCase()) {
      case 'switch':
        return switchApp(name);
      case 'layout':
        return commitCmd(`app layout ${name}`, () => { appLayout(name, layout) });                
      default:
        appSrcLayout((name) => {
          commitCmd(`${name} app src layout created`, noop);
        });        
    }    
  })
