const jsonfile = require('jsonfile');
const download = require('download-git-repo');
const ComponentRegistry = require('../registry');

module.exports = class InstallFromGit {
  constructor(componentsPath) {
    this.registry = new ComponentRegistry();
    this.componentsPath = componentsPath || this.registry.componentsPath;
  }

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

  get destinationPath() {
    return path.join(this.mountPath, this.name);
  }

  install(done) {
    download(this.repository, this.destinationPath, (err) => {
      if (err) {
        // console.log(util.inspect(err));
        if (err.statusCode === 404) {
          return done('HTTP 404 error: could not find repo', this.repository);  
        }
        return done(err);
      }
      this.registry.update();
      done();
    });    
  }
}