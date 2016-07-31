#!/usr/bin/env node

const program = require('commander');
const InstallFromGit = require('./lib/commands/install');
const UnInstall = require('./lib/commands/uninstall');
const InstallPlugin = require('./lib/commands/plugin');

const ComponentBundler = require('./lib/commands/bundle'); 
const ComponentCreator = require('./lib/commands/create');
const VendorBundler = require('./lib/commands/vendor');
const InitProject = require('./lib/commands/init');
const InstallTypings = require('./lib/commands/typings');

const util = require('util');
const download = require('download-git-repo');

program
  .version('0.0.1')

program
  .command('init')
  .description('Initialize project with settings for installer')
  .action(function() {
    // TODO:
    // try to detect settings
    // command prompt to confirm or say prefs

    new InitProject(settings).initialize((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(repo, 'initialized');
    });
  })

program
  .command('install <repo> [mountPath]')
  .description('Install a component from a git repo')
  .action(function(repo) {
    new InstallFromGit().named(repo).at(mountPath).install((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(repo, 'installed');
    });
  })

program
  .command('plugin <name>')
  .description('Install an Aurelia plugin')
  .action(function(name) {
    new InstallPlugin(name).install((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(name, 'plugin installed');
    });
  })

program
  .command('typings <name>')
  .description('Install a typings definition by name')
  .action(function(name) {
    new InstallTypings(name).install((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(name, 'typings installed');
    });
  })


program
  .command('uninstall <name> [mountPath]')
  .description('Uninstall a component')
  .action(function(name) {
    new UnInstall().named(name).at(mountPath).uninstall((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(name, 'uninstalled');
    });
  })

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
  .command('create <name> [mountPath]')
  .description('Create a component within the application')
  .action(function(name, mountPath) {    
    new ComponentCreator().named(name).at(mountPath).create();
  })

program.parse(process.argv);  