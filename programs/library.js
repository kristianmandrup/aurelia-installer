const program = require('commander');
const VendorLibraryBundler = require('../lib/commands/vendor');

program
  .command('library [name]')
  .description('Bundle a vendor library with aurelia.json')
  .action(function(name) {    
    new VendorLibraryBundler().bundle(name);
  })
