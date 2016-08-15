const fs = require('fs-extra');
const path = require('path');
const log = require('../log');
const c = log.c;
const Registry = require('../registry');

module.exports = class UnInstall {
  constructor(componentsPath) {
    this.registry = new Registry();
    this.componentsPath = componentsPath || this.registry.componentsPath;
  }

  named(name) {
    this.name = name;
    return this;
  }

  at(mountPath) {
    this._mountPath = mountPath || this.registeredPath;
    return this; 
  }

  get registeredPath() {
    this.registry.componentLocation(this.name);
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

  // TODO: also remove from registry
  uninstall() {
    try {
      let stat = fs.statSync(this.destinationPath);
      if(stat.isDirectory()) {
        fs.remove(this.destinationPath, (err) => {
          if (!err) throw 'Remove error';
          this.registry.uninstall(this.name);                      
        });     
      } else {
        throw 'Not a directory error';
      } 
    } catch (e) {
      this.handleErr();
    }
  }

  handleErr() {
    console.error(c.error('No component'), c.important(this.name), c.error('found in:'), this.componentsPath);
    throw 'Uninstall error';              
  }
}