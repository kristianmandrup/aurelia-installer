const program = require('commander');
const InstallTypings = require('../lib/commands/typings');
const TypingsList = require('../lib/commands/typings/list');

program
  .command('typings <name>')
  .description('Install a typings definition by name')
  .action(function(name) {
    if (name === ':list') {
      return new TypingsList().list();
    }

    new InstallTypings(name).install((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(name, 'typings installed');
    });
  })
