const program = require('commander');
const ComponentBundler = require('../lib/commands/bundle');
const commit = require('../lib/commit');

program
  .command('bundle [name]')
  .description('Bundle a component with the application')
  .action(function(name) {    
    new ComponentBundler().bundle(name, (err) => {
      if (!err) {
        commit(`component ${name} bundled`);
      }
    });
  })
