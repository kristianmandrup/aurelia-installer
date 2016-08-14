const program = require('commander');
const ComponentUnBundler = require('../lib/commands/unbundle');
const commit = require('../lib/commit');

program
  .command('unbundle <name>')
  .description('Unbundle a component from the application')
  .action(function(name) {    
    new ComponentUnBundler().unbundle(name, (err) => {
      if (!err) {
        commit(`component ${name} unbundled`);
      }
    });
  })
