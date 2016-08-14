const program = require('commander');
const Manifest = require('../lib/commands/manifest');

program
  .command('manifest')
  .description('Create manifest for progessive web app')
  .action(function() {
    new Manifest().create();
  })
