const jsonfile = require('jsonfile');
const download = require('download-git-repo');
const defaults = {
  componentsPath: './src/components',
  componentsRegPath: './components.json',
  initialRegitry: {}
};

module.exports = class InstallFromGit {
  constructor(componentsPath) {
    this.componentsPath = componentsPath || defaults.componentsPath;
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
      this.updateRegistry();
      done();
    });    
  }

  get componentsRegPath() {
    return defaults.componentsRegPath;
  }

  ensureComponentsRegistry() {
    try {
      if (fs.statSync(filePath).isFile()) {
        return true;    
      }
      this.createComponentsRegistry();
    } catch (e) {
      console.error('Error checking for components.json file in project')
    } 
  }

  get initialRegitry() {
    return defaults.initialRegitry;
  }

  createComponentsRegistry() {
    const registryObj =     
    jsonfile.writeFile(this.componentsRegPath, this.initialRegitry, {spaces: 2}, (err) => {
      if (err) {
        log.error('write error', defaults.componentsRegPath, err);
        process.exit(1);
      }
    });
  }   

  updateRegistry() {
    jsonfile.readFile(this.componentsRegPath, (err, config) => {
      if (err) {
        log.error('read error', this.componentsRegPath, err);
        process.exit(1);
      }
      config[this.name] = this.destinationPath;

      jsonfile.writeFile(this.componentsRegPath, config, {spaces: 2}, (err) => {
        if (err) {
          log.error('write error', this.componentsRegPath, err);
          process.exit(1);
        }
      });
    })
  }
}