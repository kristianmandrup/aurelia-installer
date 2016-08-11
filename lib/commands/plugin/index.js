const registry = require('../../../registry/plugins');
const proc = require('child_process');
const exec = proc.exec;
const spawn = proc.spawn;
const fs = require('fs-extra');
const path = require('path');
const suppose = require('suppose');
const _ = require('lodash');
const prepend = require('prepend-file');
const log = require('../log');
const c = log.c;
const fileAt = require('../utils').fileAt;

function shellCmd(command, ...args) {  
  let fullCmd = `${command} ${args.join(' ')}`;
  log.info(fullCmd);

  suppose(command, args)
  .when(/prefix/).respond('yes\n')
  .when(/baseUrl/).respond('\n')
  .when(/folder/).respond('\n')
  .when(/config/).respond('\n')
  .when(/transpiler/).respond('\n')
  .on('error', function(err){
    console.log(err.message);
  })
  .end(function(code){
    console.log('DONE');
  });
}

const Preferences = require('../preferences');

module.exports = class InstallPlugin {
  constructor(name) {
    this.name = name;   
    this.preferences = new Preferences(); 
  }

  get moduleSystem() {
    if (this.packageManager === 'webpack') return 'npm';
    return 'jspm';
  }

  get packageManager() {
    return this.preferences.packageManager;
  }

  get entry() {
    return registry[this.name];
  }

  install() {
    this.resolveEntry();
    this.installJspm();
    this.installNode();

    this.usePlugin();         
  }

  usePlugin() {
    const CustomInstaller = customInstallers[this.name];
    if (CustomInstaller) {
      new CustomInstaller(this.fullName).execute();
    } else {
      new UsePlugin(this.fullName).execute();
    }    
  }

  installJspm() {
    if (!this.jspm) {
      return;
    }
    // -y say yes to any prompt ??
    shellCmd('jspm', 'install', this.jspm);
  }
  
  installNode() {
    if (!this.npm) {
      return;
    }    
    shellCmd('npm', 'install', this.npm, '--save');
  }

  resolveEntry() {
    let entry = this.entry;
    if (!entry) {
      console.log('Plugin', this.name, 'has not yet been registered with this installer');
      console.log('Please add the plugin configuration at: https://github.com/kristianmandrup/aurelia-installer');
      process.exit(1);
    }
    if (typeof entry === 'string') {
      this[this.moduleSystem] = entry; // default
      this.fullName = entry;
      return;
    } else {
      if (entry.jspm) {
        this.jspm = entry.jspm;
      }
      if (entry.npm) {
        this.npm = entry.npm;
      }
    }
    this.fullName = this.jspm || this.npm;    
  }    
}

class UsePlugin {
  constructor(fullName) {
    this.fullName = fullName;
  }

  execute() {
    this.ensurePluginsFile();
    this.addUse((err) => {
      if (err) {
        process.exit(1);
      }
      log.success('Aurelia configured to use plugin:', this.fullName);
    });  
  }

  ensurePluginsFile() {
    const jsFile = './src/plugins.js';
    const tsFile = './src/plugins.ts';
    this.pluginsFile = fileAt(jsFile) || fileAt(tsFile);

    if (!this.pluginsFile) {
      log.info(`Creating missing plugins.js file. Use it from main.ts`);      
      try {
        let sourceFile = path.join(__dirname, 'templates', 'plugins.js');
        fs.copySync(sourceFile, jsFile);
        this.pluginsFile = jsFile;
      } catch (err) {
        log.error('Error creating plugins config file: plugins.js');        
      }
    }    
  }  

  postInstall() {    
  }

  get useLine() {
    return `aurelia.use.plugin('${this.fullName}');\n`
  }

  prependFile(filePath, txt) {    
    prepend(filePath, txt, function(err) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });    
  }

  addUse(done) {
    if (!fileAt(this.pluginsFile)) {
      log.error('Error:', this.pluginsFile, 'not found');
    }
    fs.readFile(this.pluginsFile, 'utf8', (err, data) => {
      if (err) {
        log.error('Read error:', this.pluginsFile, err);
        done(err);
      }

      let reg = new RegExp(_.escapeRegExp(this.useLine));
      if (data.match(reg)) {
        log.warn('Aborting: plugin is already used');
        process.exit(1);
      }

      let newData = data.replace(/\/\/ more plugins here/, `${this.useLine}\n  // more plugins here`);

      fs.writeFile(this.pluginsFile, newData, 'utf8', (err, data) => {
        if (err) {
          log.error('Write error:', this.pluginsFile, err);
          done(err);
        }
        done();
      })
    })
  }
}

// Allows for customization of specific plugins 

class AuthPlugin extends UsePlugin {
  constructor(fullName) {    
    super(fullName);
  }

  get useLine() {
    return `aurelia.use.plugin('aurelia-auth', (config)=>{
    config.configure(authConfig);
  });`
  }

  postInstall() {   
    console.log('post install');    
    try {
      let fileName = 'auth-config.js';
      let sourcePath = path.join(__dirname, 'templates', fileName);
      let destPath = path.join('.src/', fileName)
      fs.copySync(sourcePath, destPath);
    } catch (err) {
      console.error('Error creating auth provider configuration file:', fileName);        
    }     

    prependFile(this.pluginsFile, "import authConfig from './auth-config'");
  }
}

class MaterializePlugin extends UsePlugin {
  constructor(fullName) {
    super(fullName);
  }
  
  get useLine() {
    let sourcePath = path.join(__dirname, 'templates/materialize.js');
    return fs.readFileSync(sourcePath, 'utf8');
  }
}

const customInstallers = {
  auth: AuthPlugin,
  materialize: MaterializePlugin  
};
