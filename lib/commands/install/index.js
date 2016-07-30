const download = require('download-git-repo');
const defaults = {
  componentsPath: './src/components'
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

  get destinationPath() {
    return path.join(this.componentsPath, this.name);
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
      done();
    });    
  }
}