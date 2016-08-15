const program = require('commander');
const InstallPlugin = require('../lib/commands/plugin');
const PluginList = require('../lib/commands/plugin/list');
const commitCmd = require('../lib/command');

function installPlugin(name) {
  new InstallPlugin(name).install();
}

program
  .command('plugin <name>')
  .description('Install an Aurelia plugin')
  .action(function(name) {
    if (name === ':list') {
      return new PluginList().list();
    }
    commitCmd(`plugin ${name} installed`, () => { installPlugin(name) });
  })
