#!/usr/bin/env node

const program = require('commander');
 
program
  .version('0.0.1')

const programs = ['app', 'bundle','create', 'init', 'install', 'library', 'plugin', 'typings', 'uninstall'];

programs.forEach(prog => {
  require(`./programs/${prog}`);
})

program.parse(process.argv);

