const command = require('./command');
const program = require('commander');
const _ = require('lodash');

program
  // `bundle [component|lib] <names>`
  .command('bundle <type> [names]')
  .description('Bundle one or more components')
  .action((type, names) => {
    names = names.split(',').map(name => _.trim(name));

    switch (type) {
      case 'lib':
        return command.library.bundle(...names);
      default:
        return command.component(...names).bundle(); 
    }        
  });

