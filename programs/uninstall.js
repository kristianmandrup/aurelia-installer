const UnInstall = require('./lib/commands/uninstall');

program
  .command('uninstall <name> [mountPath]')
  .description('Uninstall a component')
  .action(function(name) {
    new UnInstall().named(name).at(mountPath).uninstall((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(name, 'uninstalled');
    });
  })
