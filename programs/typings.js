const program = require('commander');
const InstallTypings = require('../lib/commands/typings');
const TypingsList = require('../lib/commands/typings/list');
const commitCmd = require('../lib/command');

function installTypings(name) {
  new InstallTypings(name).install();
}

program
  .command('typings <name>')
  .description('Install a typings definition by name')
  .action(function(name) {
    if (name === ':list') {
      return new TypingsList().list();
    }
    commitCmd(`typings ${name} installed`, () => { installTypings(name) });
  })
