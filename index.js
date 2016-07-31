#!/usr/bin/env node

const program = require('commander');
 
program
  .version('0.0.1')

['bundle','create', 'init', 'install', 'library', 'plugin', 'typings', 'uninstall'].forEach(program => {
  require('./program');
})

program.parse(process.argv);

