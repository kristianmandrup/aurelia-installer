const program = require('commander');
const ComponentCreator = require('../lib/commands/create');

program
  .command('create <name> [mountPath]')
  .description('Create a component within the application')
  .action(function(name, mountPath) {
    new ComponentCreator().named(name).view(answers.hasView).at(mountPath).create();
  })
