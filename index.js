#!/usr/bin/env node

const program = require('commander');
const InstallFromGit = require('./lib/commands/install');
const UnInstall = require('./lib/commands/uninstall');
const ComponentBundler = require('./lib/commands/bundle'); 
const ComponentCreator = require('./lib/commands/create');
const VendorBundler = require('./lib/commands/vendor');

const util = require('util');
const download = require('download-git-repo');

program
  .version('0.0.1')

program
  .command('install <repo>')
  .description('Install a component from a git repo')
  .action(function(repo) {
    new InstallFromGit().named(repo).install((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(repo, 'installed');
    });
  })
  .parse(process.argv);

program
  .command('uninstall <name>')
  .description('Uninstall a component')
  .action(function(name) {
    new UnInstall().named(name).uninstall((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(name, 'uninstalled');
    });
  })
  .parse(process.argv);

program
  .command('bundle [name]')
  .description('Bundle a component with the application')
  .action(function(name) {    
    new ComponentBundler().bundle(name);
  })

program
  .command('vendor [name]')
  .description('Bundle a vendor library with aurelia.json')
  .action(function(name) {    
    new VendorBundler().bundle(name);
  })

program
  .command('create <name>')
  .description('Create a component within the application')
  .action(function(name) {    
    new ComponentCreator().named(name).create();
  })

program.parse(process.argv);  