const command = require('./command');
const program = require('commander');

program
  // `uninstall [app|typings|lib|component|plugin|addon] <names>`
  .command('uninstall <type> <names> [mountPath]')
  .description('Uninstall an app, component, library, typings, plugin or addon')
  .action(function(names, mountPath = 'components') {
    switch (type) {
      case 'app':
        return command.app.uninstall(...names);
      case 'typings':
        return command.typings.uninstall(...names);
      case 'lib':
        return command.lib.uninstall(...names);
      case 'plugin':
        return command.plugin.uninstall(...names);
      case 'addon':
        return command.addon.uninstall(...names);
      default:
        command.component.uninstall(...names); 
    }    
  })
