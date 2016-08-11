const program = require('commander');
const ComponentBundler = require('../lib/commands/bundle');

program
  .command('bundle [name]')
  .description('Bundle a component with the application')
  .action(function(name) {    
    new ComponentBundler().bundle(name);
  })
