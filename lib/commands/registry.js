// default locations in client project
const defaults = {
  componentsPath: './src/components', // where to put installed components by default
  installerConfigPath: './installer.json', // component registry of app (to update on install)  
  initialRegistry: {}
};

const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const jsonfile = require('jsonfile');
const log = require('./log');
const c = log.c;

module.exports = class ComponentRegistry {
  // override default component install location ie. for mounting
  constructor(componentsPath) {
    this.componentsPath = componentsPath || defaults.componentsPath;
    this.installerConfigPath = defaults.installerConfigPath;  
    this.read();   
  }

  get initialReg() {
    return defaults.initialRegistry;
  }

  ensurePresent(filePath) {
    try {
      let stats = fs.statSync(filePath); 
      if (stats.isFile() && stats.size > 0) {
        return true;
      } else {
        this.create();
      }      
    } catch (e) {
      if (e.code === 'ENOENT') {
        this.create();
      } else {
        console.error(`Error checking for ${filePath} in project`, e);
      }      
    } 
  }

  create() {     
    log.info('creating installer config:', this.installerConfigPath);
    try {
      jsonfile.writeFileSync(this.installerConfigPath, this.initialReg, {spaces: 2})
    } catch (e) {
      log.error('write error', this.installerConfigPath, err);
      process.exit(1);
    }    
  }   

  get components() {
    return this.read().components;
  }

  get packageManager() {
    return this.read().packageManager;
  }

  get gitAccount() {
    return this.read().gitAccount;
  }

  get srcLayout() {
    return this.read().srcLayout;
  }

  get defaultLayout() {
    return this.read().defaultLayout || 'simple';
  }

  get appPath() {
    return this.read().appPath || './src';
  }

  componentLocation(name) {
    if (!this.components) return null;
    return path.join(this.appPath, this.components[name]);
  }

  read(force) {
    if (this.db && !force) {
      return this.db;
    }    

    try {
      this.ensurePresent(this.installerConfigPath);
      let config = jsonfile.readFileSync(this.installerConfigPath)
      // ie. componentsPath in components.json registry can override default componentsPath src/components
      if (config.componentsPath) {
        this.componentsPath = config.componentsPath;
      }
      return this.db = config;
    } catch (err) {
      log.error('read error', this.installerConfigPath, err);
      process.exit(1);
    }    
  }

  write(mergeConfig) {
    this.ensurePresent(this.installerConfigPath);
    jsonfile.readFile(this.installerConfigPath, (err, config) => {
      if (err) {
        log.error('write: read error', this.installerConfigPath, err);
        process.exit(1);
      }
      // lodash deep merge!
      config = _.merge(config, mergeConfig);
      jsonfile.writeFile(this.installerConfigPath, config, {spaces: 2}, (err) => {
        if (err) {
          log.error('write error', this.installerConfigPath, err);
          process.exit(1);
        }
      });            
    });        
  }

  install(name, destinationPath) {
    let components = {} 
    components[name] = destinationPath;

    this.write({
      components: components
    });    
  }
}
