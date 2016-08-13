const jsonfile = require('jsonfile');
const download = require('download-git-repo');
const Registry = require('../registry');
const path = require('path');
const log = require('../log');
const c = log.c;

module.exports = class InstallFromGit {
  constructor(componentsPath) {
    this.registry = new Registry();
    this.componentsPath = componentsPath || this.registry.componentsPath;
  }

  // such as kristianmandrup/
  named(repository) {
    this.repository = repository;
    let repoName = /([^\\\/]+)$/.exec(repository)[1];
    this.name = repoName;
    return this;
  }

  at(mountPath) {
    this._mountPath = mountPath;
    return this; 
  }

  get mountPath() {
    return this._mountPath || this.componentsPath; 
  }

  get appPath() {
    return this.registry.appPath;
  }

  get destinationPath() {
    return path.join(this.appPath, this.mountPath, this.name);
  }

  install(done) {
    if (!this.repository.match(/\//)) {
      let gitAccount = this.registry.gitAccount;
      if (gitAccount) {
        console.log('using default git account:', gitAccount);
        this.repository = path.join(gitAccount, this.name);
        return this.install(done);
      } else {
        return done('Repo naming error, must be one of the allowed forms, such as: <account>/<repo name>', this.repository);
      }
    }

    log.info('downloading git repo from', this.repository);
    download(this.repository, this.destinationPath, (err) => {
      if (err) {
        // console.log(util.inspect(err));
        if (err.statusCode === 404) {
          return done('HTTP 404 error: could not find repo', this.repository);  
        }
        return done(err);
      }
      this.registry.install(this.name, this.destinationPath);
      done();
    });    
  }
}