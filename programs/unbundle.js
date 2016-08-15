const program = require('commander');
const ComponentUnBundler = require('../lib/commands/unbundle');
const commitCmd = require('../lib/command');

function unbundle(name) {
  new ComponentUnBundler().unbundle(name);
}

program
  .command('unbundle <name>')
  .description('Unbundle a component from the application')
  .action(function(name) {
    commitCmd(`component ${name} unbundled`, () => { unbundle(name) });
  })
