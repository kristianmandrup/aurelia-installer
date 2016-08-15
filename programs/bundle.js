const program = require('commander');
const ComponentBundler = require('../lib/commands/bundle');
const commitCmd = require('../lib/command');

function bundle(name) {
  new ComponentBundler().bundle(name);
}

program
  .command('bundle [name]')
  .description('Bundle a component with the application')
  .action(function(name) {
    commitCmd(`component ${name} bundled`, () => { bundle(name) });    
  })
