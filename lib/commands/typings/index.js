// implement procedure to download and install typings for some vendor libs

function listen(child, done) {
  child.stdout.on('data', function(data) {
      console.log('' + data);
  });
  child.stderr.on('data', function(err) {
      console.error('' + err);
      done(err);
  });
  child.on('close', function(code) {
    done(code);
  });   
}

function shellCmd(command, args, done) {  
  let fullCmd = `${command} ${args.join(' ')}`;
  log.info(fullCmd);

  let child = exec(fullCmd);
  listen(child, (code) => {
    done(code);
  });
}

const registry = require('../../../registry/typings.json')

// TODO: use registry/typings.json for custom install procedures
module.exports = class InstallTypings {
  constructor(name) {
    this.name = name;
  }

  location() {

  }

  install(done) {
    shellCmd('typings', ['install', this.name, '--save'], done);
  }
}
