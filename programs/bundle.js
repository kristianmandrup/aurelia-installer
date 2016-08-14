const program = require('commander');
const ComponentBundler = require('../lib/commands/bundle');
const GitWorkflow = require('../lib/git-workflow');

program
  .command('bundle [name]')
  .description('Bundle a component with the application')
  .action(function(name) {    
    new ComponentBundler().bundle(name, (err) => {
      if (!err) {
        new GitWorkflow().commit(`component ${name} bundled`);
      }
    });
  })
