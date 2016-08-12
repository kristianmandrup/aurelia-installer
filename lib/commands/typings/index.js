// implement procedure to download and install typings for some vendor libs

const proc = require('child_process');
const exec = proc.exec;
const spawn = proc.spawn;

const log = require('../log');
const c = log.c;


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

  get location() {
    return registry[this.name] || this.name;
  }

  install(done) {
    // global is the new ambient!
    shellCmd('typings', ['install', this.location, '--global'], done);
  }
}
