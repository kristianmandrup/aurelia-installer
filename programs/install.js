const command = require('./command');
const program = require('commander');
const util = require('./command/util');

program
  // `install [app|typings|lib|component|plugin|addon] <names>` 
  .command('install <type> <names> [mountPath]')
  .description('Install an app, component typings, library, plugin or addon')
  .action((type, names, mountPath) => {
    names = util.normalize(names.split(','));
    // [app|layout|plugin|manifest]
    switch (type) {
      case 'app':
        return command.app.install(mountPath, ...names);
      case 'typings':
        return command.typings.install(...names);
      case 'lib':
        return command.lib.install(...names);
      case 'plugin':
        return command.plugin.install(...names);
      case 'addon':
        return command.addon.install(...names);
      default:
        command.component.install(mountPath, ...names); 
    }
  })