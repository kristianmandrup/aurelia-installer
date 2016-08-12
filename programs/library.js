const program = require('commander');
const VendorLibraryBundler = require('../lib/commands/vendor');
const VendorLibList = require('../lib/commands/vendor/list');

program
  .command('library [name]')
  .description('Bundle a vendor library with aurelia.json')
  .action(function(name) {
    if (name === ':list') {
      return new VendorLibList().list();
    }        

    new VendorLibraryBundler().bundle(name);
  })
