const program = require('commander');
const ComponentCreator = require('../lib/commands/create');
const commitCmd = require('../lib/command');

function create(name, mountPath) {
  new ComponentCreator().at(mountPath).named(name).create();
}

program
  .command('create <name> [mountPath]')
  .description('Create a component within the application')
  .action(function(name, mountPath) {
    commitCmd(`component ${name} created`, () => { create(name, mountPath) });
  })
