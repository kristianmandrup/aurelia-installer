const program = require('commander');
const InstallFromGit = require('../lib/commands/install');
const log = require('../lib/commands/log');
const c = log.c;
const commitCmd = require('../lib/command');

function install(repo, mountPath) {
  new InstallFromGit().named(repo).at(mountPath).install();
}

program
  // TODO: introduce <componentType> so as to allow:
  // ai install page kristianmandrup/my-page 
  .command('install <repo> [mountPath]')
  .description('Install a component from a git repo')
  .action(function(repo, mountPath) {
    commitCmd(`component ${name} installed`, () => { install(repo, mountPath) });
  })