const program = require('commander');
const InstallFromGit = require('../lib/commands/install');
const log = require('../lib/commands/log');
const c = log.c;

program
  // TODO: introduce <componentType> so as to allow:
  // ai install page kristianmandrup/my-page 
  .command('install <repo> [mountPath]')
  .description('Install a component from a git repo')
  .action(function(repo, mountPath) {
    new InstallFromGit().named(repo).at(mountPath).install((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      log.success(repo, 'installed');
    });
  })