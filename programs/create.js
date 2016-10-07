const command = require('./command');
const program = require('commander');

program
  // `create [app|layout|plugin|manifest] <name>`
  .command('create <type> [name]')
  .description('Bundle one or more components')
  .action((type, name) => {

    // [app|layout|plugin|manifest]
    switch (type) {
      case 'app':
        return command.app.create(name);
      case 'pwa':
        return command.app.pwa.create();
      case 'layout':
        return command.app.layout.create(name);
      case 'plugin':
        return command.plugin.create(name);
      default:
        command.component.create(name); 
    }        
  })
