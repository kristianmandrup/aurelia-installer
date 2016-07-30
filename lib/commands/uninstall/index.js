const fs = require('fs-extra');
const path = require('path');
const log = require('../log');
const c = log.c;

const defaults = {
  componentsPath: './src/components'
};

module.exports = class UnInstall {
  constructor(componentsPath) {
    this.componentsPath = componentsPath || defaults.componentsPath;
  }

  named(name) {
    this.name = name;
    return this;
  }

  get destinationPath() {
    return path.join(this.componentsPath, this.name);
  }

  uninstall(done) {
    try {
      let stat = fs.statSync(this.destinationPath);
      if(stat.isDirectory()) {
        fs.remove(this.destinationPath, (err) => {
            done(err);          
        });     
      } else {
        this.handleErr();
      } 
    } catch (e) {
      this.handleErr();
    }
  }

  handleErr() {
    console.error(c.error('No component'), c.important(this.name), c.error('found in:'), this.componentsPath);
    process.exit(1);              
  }
}