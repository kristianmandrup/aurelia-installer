const program = require('commander');
const VendorLibraryBundler = require('../lib/commands/vendor');
const VendorLibList = require('../lib/commands/vendor/list');

program
  .command('library <name> [option]')
  .description('Bundle a vendor library with aurelia.json')
  .action(function(name, option = '') {
    if (name === ':list') {
      return new VendorLibList().list();
    }        

    const bundler = new VendorLibraryBundler();

    if (option.match(/unbundle/)) {
      bundler.unbundle(name);
    } else {
      bundler.bundle(name);
    }    
  })
