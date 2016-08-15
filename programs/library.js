const program = require('commander');
const VendorLibraryBundler = require('../lib/commands/library');
const VendorLibList = require('../lib/commands/library/list');
const commitCmd = require('../lib/command');
const bundler = new VendorLibraryBundler();

program
  .command('library <name> [option]')
  .description('Bundle a vendor library with aurelia.json')
  .action(function(name, option = '') {
    if (name === ':list') {
      return new VendorLibList().list();
    }        

    if (option.match(/unbundle/)) {
      commitCmd(`library ${name} unbundled`, () => { bundler.unbundle(name) });
    } else {
      commitCmd(`library ${name} bundled`, () => { bundler.bundle(name) });
    }    
  })
