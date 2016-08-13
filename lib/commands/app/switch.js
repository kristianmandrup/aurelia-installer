const Registry = require('../registry');

module.exports = class AppSwitcher {
  constructor(name) {
    this.name = name;
    this.registry = new Registry();
  }

  get appsBasePath() {
    return this.multi ? './src/apps' : './src';
  }

  get isRoot() {
    return this.name === ':root';
  }

  get appPath() {
    if (this.isRoot) return '.';
    return path.join(this.appsBasePath, this.name);
  }

  validate() {
    if (this.isRoot) return true;
    try {
      const stats = fs.statsSync(this.appPath);
      return stats.isDirectory() ? true : false;
    } catch (e) {
      return false;
    }    
  }

  get multi() {
    return this.registry.srcLayout === 'multi';
  }  

  switch() {
    if (this.validate()) {
      return this.registry.write({
        currentApp: this.name,
        appPath: this.appPath
      });
    }
    else {
      log.error(`No such as ${this.name} could be found in ${this.appsBasePath}`)
    }
  }
}
