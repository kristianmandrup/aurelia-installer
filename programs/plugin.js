const program = require('commander');
const InstallPlugin = require('../lib/commands/plugin');

program
  .command('plugin <name>')
  .description('Install an Aurelia plugin')
  .action(function(name) {
    new InstallPlugin(name).install((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(name, 'plugin installed');
    });
  })
