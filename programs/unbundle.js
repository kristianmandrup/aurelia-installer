const command = require('./command');
const program = require('commander');

program
  .command('unbundle <name>')
  .description('Unbundle a component from the application')
  .action((type, names) => {
    names = names.split(',').map(name => _.trim(name));
    switch (type) {
      case 'lib':
        return command.library.unbundle(...names);
      default:
        return command.component.unbundle(...names); 
    }        

  })
