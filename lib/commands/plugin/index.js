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

const customInstallers = require('./plugins');

function shellCmd(command, ...args) {  
  let fullCmd = `${command} ${args.join(' ')}`;
  log.info(fullCmd);

  // TODO: finetune responses if need be
  suppose(command, args)
  // .when(/prefix/).respond('yes\n')
  // .when(/baseUrl/).respond('\n')
  // .when(/folder/).respond('\n')
  // .when(/config/).respond('\n')
  // .when(/transpiler/).respond('\n')
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
    return this.packageManager === 'npm' ? 'npm' : 'jspm';
  }

  get packageManager() {
    return this.preferences.packageManager;
  }

  get entry() {
    return registry[this.name];
  }

  install() {
    this.resolveEntry();
    // console.log('package manager:', this.packageManager);
    // console.log('module system:', this.moduleSystem);

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
    shellCmd('jspm', 'install', this.jspm, '-y');
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
      if (err) throw err;
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
        fs.copySync(sourceFile, this.pluginsFile);
      } catch (err) {
        throw `Error creating plugins config file: ${this.pluginsFile}`;        
      }
    }    
  }  

  // override for custom post install
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
      throw `Error:', ${this.pluginsFile}`;
    }
    fs.readFile(this.pluginsFile, 'utf8', (err, data) => {
      if (err) {
        throw `Read error: ${this.pluginsFile}`;
      }

      let reg = new RegExp(_.escapeRegExp(this.useLine));
      if (data.match(reg)) {
        throw 'Aborting: plugin is already used';
      }

      let newData = data.replace(/\/\/ more plugins here/, `${this.useLine}\n  // more plugins here`);

      fs.writeFile(this.pluginsFile, newData, 'utf8', (err, data) => {
        if (err) {
          throw `Write error: ${this.pluginsFile}`;
        }
        done();
      })
    })
  }
}
