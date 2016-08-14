// default locations in client project
const defaults = {
  componentsPath: './src/components', // where to put installed components by default
  installerConfigPath: './installer.json', // component registry of app (to update on install)  
  initialRegistry: {}
};

const ComponentBundler = require('./bundle');
const ComponentUnBundler = require('./unbundle');
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const jsonfile = require('jsonfile');
const log = require('./log');
const c = log.c;

const vendorLibs = require('../../registry/vendor-libs.json');

module.exports = class ComponentRegistry {
  // override default component install location ie. for mounting
  constructor(componentsPath) {
    this.componentsPath = componentsPath || defaults.componentsPath;
    this.installerConfigPath = defaults.installerConfigPath;
    this.bundler = new ComponentBundler();  
    this.unbundler = new ComponentUnBundler();
    this.read();   
  }

  get initialReg() {
    return defaults.initialRegistry;
  }

  markAsBundled(name) {
    this.setComponent(name, {bundled: true }) 
  }

  markAsUnBundled(name) {
    this.setComponent(name, {bundled: false }) 
  }

  setComponent(name, obj) {
    let config = this.component(name);
    let newConfig = _.merge(config, obj);
    this.components[name] = newConfig;
    this.rewrite();
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

  get component(name) {
    return this.components[name];
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
    if (!this.components || !this.component(name)) return null;
    return path.join(this.appPath, this.component(name).location);
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

  rewrite() {
    this.write(this.db);
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

  bundle(name) {
    this.bundler.bundle(name);
  }

  unbundle(name) {
    this.unbundler.unbundle(name);
  }

  uninstall(name) {
    delete this.components[name];
    this.rewrite();
    if (this.autoBundle) {
      this.unbundle(this.name);
    }
  }

  // iterate dependencies for each bundles component
  // see if there is a conflict
  // return list of conflicting components, false if no conflicts   
  isIndependentBundleDependency(dependency) {
    let res = this.components.map(name => {
      return this.hasSharedDependency(name, dependency);
    });
    return res.length > 0 ? res : false;
  }

  hasSharedDependency(name, dependency) {
    let componentPath = this.componentLocation(name);
    let componentConfigPath = path.join(componentPath, 'install.json');
    let config = jsonfile.readFileSync(componentConfigPath);
    if (config.dependencies) {
      return config.dependencies.indexOf(dependency) >= 0;
    }
    if (config.bundles && config.bundles.length < 0) {
      return config.bundles.find(bundle => {
        let bundleConfig = vendorLibs[bundle];
        return bundleConfig.dependencies && bundleConfig.dependencies.indexOf(dependency) >= 0 
      })        
    }
    return false;       
  }

  install(name, destinationPath) {
    let components = {} 
    components[name] = components[name] || {};
    components[name].location = destinationPath;
    components[name].bundled = false;

    if (this.autoBundle) {
      this.bundler.bundle(name);
    }     
    this.write({
      components: components
    });    
  }
}
