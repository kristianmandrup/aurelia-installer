const program = require('commander');
const UnInstall = require('../lib/commands/uninstall');
const commitCmd = require('../lib/command');

function uninstall(name, mountPath) {
  new UnInstall().named(name).at(mountPath).uninstall();
} 
  
program
  .command('uninstall <name> [mountPath]')
  .description('Uninstall a component')
  .action(function(name, mountPath = 'components') {
    commitCmd(`component ${name} uninstalled`, () => { uninstall(name) });
  })
