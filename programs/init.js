const program = require('commander');
const InitProject = require('../lib/commands/init');

program
  .command('init')
  .description('Initialize project with settings for installer')
  .action(function() {
    // TODO:
    // try to detect settings
    // command prompt to confirm or say prefs
    let settings = {}

    new InitProject(settings).initialize((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(repo, 'initialized');
    });
  })
