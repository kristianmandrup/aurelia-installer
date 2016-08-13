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

const Preferences = require('../preferences');
const registry = require('../../../registry/typings.json')

// TODO: use registry/typings.json for custom install procedures
module.exports = class InstallTypings {
  constructor(name) {
    this.name = name;
    this.preferences = new Preferences();    
  }

  get location() {
    return registry[this.name] || `dt~${this.name}`;
  }

  install(done) {
    if (!this.preferences.useTypeScript) {
      // log.info('ABORT: Typescript not detected in project')
      done();
    }

    // global is the new ambient!
    if (this.location) {
      shellCmd('typings', ['install', this.location, '--global'], done);
    } else {
      log.info(`No typings registered for ${this.name}`);
    }    
  }
}
