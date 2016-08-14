const program = require('commander');
const ComponentCreator = require('../lib/commands/create');
const commit = require('../lib/commit');

program
  .command('create <name> [mountPath]')
  .description('Create a component within the application')
  .action(function(name, mountPath) {
    new ComponentCreator().at(mountPath).named(name).create(() => {
      commit(`component ${name} created`);
    });
  })
