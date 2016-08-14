const program = require('commander');
const UnInstall = require('../lib/commands/uninstall');
const commit = require('../lib/commit');

program
  .command('uninstall <name> [mountPath]')
  .description('Uninstall a component')
  .action(function(name, mountPath = 'components') {
    new UnInstall().named(name).at(mountPath).uninstall((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(name, 'uninstalled');
      commit(`component ${name} uninstalled`);
    });
  })
