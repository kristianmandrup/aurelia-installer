const program = require('commander');
const InstallTypings = require('./lib/commands/typings');

program
  .command('typings <name>')
  .description('Install a typings definition by name')
  .action(function(name) {
    new InstallTypings(name).install((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(name, 'typings installed');
    });
  })
