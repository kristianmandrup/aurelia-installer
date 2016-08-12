const program = require('commander');
const InstallPlugin = require('../lib/commands/plugin');
const PluginList = require('../lib/commands/plugin/list');

program
  .command('plugin <name>')
  .description('Install an Aurelia plugin')
  .action(function(name) {
    if (name === ':list') {
      return new PluginList().list();
    }

    new InstallPlugin(name).install((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(name, 'plugin installed');
    });
  })
