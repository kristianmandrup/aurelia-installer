const defaults = {
  componentsPath: './src/components',
  componentsRegPath: './components.json',
  initialRegitry: {}
};

class ComponentRegistry {
  constructor(componentsRegPath) {
    this.componentsPath = defaults.componentsPath;
    this.componentsRegPath = componentsRegPath || defaults.componentsRegPath;     
  }

  get initialReg() {
    return defaults.initialRegitry;
  }

  ensurePresent(filePath) {
    try {
      if (fs.statSync(filePath).isFile()) {
        return true;    
      }
      this.create();
    } catch (e) {
      console.error(`Error checking for ${filePath} in project`)
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
    read();
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
    jsonfile.readFile(this.componentsRegPath, (err, config) => {
      if (err) {
        log.error('read error', this.componentsRegPath, err);
        process.exit(1);
      }
      if (config[componentsPath]) {
        this.componentsPath = config[componentsPath];
      }
      this.db = config;      
    })
  }

  update() {
    this.ensurePresent();
    jsonfile.readFile(this.componentsRegPath, (err, config) => {
      if (err) {
        log.error('read error', this.componentsRegPath, err);
        process.exit(1);
      }

      config.components = config.components || {};
      config.components[this.name] = this.destinationPath;

      jsonfile.writeFile(this.componentsRegPath, config, {spaces: 2}, (err) => {
        if (err) {
          log.error('write error', this.componentsRegPath, err);
          process.exit(1);
        }
        read(true);
      });
    })
  }
}

module.exports = {
  defaults: defaults,
  ComponentRegistry: ComponentRegistry 
}