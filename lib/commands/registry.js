// default locations in client project
const defaults = {
  componentsPath: './src/components', // where to put installed components by default
  componentsRegPath: './components.json', // component registry of app (to update on install)  
  initialRegistry: {}
};

const _ = require('lodash');
const fs = require('fs');
const jsonfile = require('jsonfile');
const log = require('./log');
const c = log.c;

module.exports = class ComponentRegistry {
  // override default component install location ie. for mounting
  constructor(componentsPath) {
    this.componentsPath = componentsPath || defaults.componentsPath;
    this.componentsRegPath = defaults.componentsRegPath;     
  }

  get initialReg() {
    return defaults.initialRegistry;
  }

  ensurePresent(filePath) {
    try {
      if (fs.statSync(filePath).isFile()) {
        return true;
      }
      this.create();
    } catch (e) {
      if (e.code === 'ENOENT') {
        this.create();
      } else {
        console.error(`Error checking for ${filePath} in project`, e);
      }      
    } 
  }

  create() {     
    jsonfile.writeFile(this.componentsRegPath, this.initialReg, {spaces: 2}, (err) => {
      if (err) {
        log.error('write error', defaults.componentsRegPath, err);
        process.exit(1);
      }
    });
  }   

  componentLocation(name) {
    this.read();
    try {
      return this.db[name];
    } catch (err) {
      console.log('Error: could not read ./components.json registry in your project');
    }    
  }

  read(force) {
    if (this.db && !force) {
      return;
    }

    this.ensurePresent(this.componentsRegPath);
    try {
      let config = jsonfile.readFileSync(this.componentsRegPath)
      // ie. componentsPath in components.json registry can override default componentsPath src/components
      if (config.componentsPath) {
        this.componentsPath = config.componentsPath;
      }
      this.db = config;
      return config;
    } catch (err) {
      log.error('read error', this.componentsRegPath, err);
      process.exit(1);
    }    
  }

  write(mergeConfig) {
    this.ensurePresent(this.componentsRegPath);
    jsonfile.readFile(this.componentsRegPath, (err, config) => {
      if (err) {
        log.error('read error', this.componentsRegPath, err);
        process.exit(1);
      }
      // lodash deep merge!
      config = _.merge(config, mergeConfig);
      jsonfile.writeFile(this.componentsRegPath, config, {spaces: 2}, (err) => {
        if (err) {
          log.error('write error', this.componentsRegPath, err);
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

// module.exports = {
//   defaults: defaults,
//   ComponentRegistry: ComponentRegistry 
// }