const registry = require('./plugin-registry');
const proc = require('child_process');
const exec = proc.exec;
const spawn = proc.spawn;
const fs = require('fs-extra');
const path = require('path');
const suppose = require('suppose');
const _ = require('lodash');

const custom = {
  auth: AuthPlugin,
  materialize: MaterializePlugin  
};

function listen(child) {
  child.stdout.on('data', function(data) {
      console.log('' + data);
  });
  child.stderr.on('data', function(data) {
      console.error('' + data);
  });
  child.on('close', function(code) {
      console.log('DONE');
  });   
}

const processOpts = {detached: true, stdio: ['ignore']};

function shellCmd(command, ...args) {
  // let child = spawn('jspm', args, processOpts);
  let child = exec(`${command} ${args.join(' ')}`);
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
  // listen(child);
}

function fileAt(filePath) {
  try {
    if (fs.statSync(filePath).isFile()) {
      return filePath;
    }
  } catch (e) {
    return false;
  }
}

module.exports = class InstallPlugin {
  constructor(name) {
    this.name = name;    
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
    new UsePlugin(this.use).execute();
  }

  installJspm() {
    if (!this.jspm) {
      return;
    }
    shellCmd('jspm', 'install', this.jspm);
  }
  
  installNode() {
    if (!this.npm) {
      return;
    }
    shellCmd('npm', 'install', this.jspm, '--save');
  }

  resolveEntry() {
    let entry = this.entry;
    if (!entry) {
      console.log('Plugin', this.name, 'has not yet been registered with this installer');
      console.log('Please add the plugin configuration at: https://github.com/kristianmandrup/aurelia-installer');
      process.exit(1);
    }
    if (typeof entry === 'string') {
      this.jspm = entry; // default
      this.use = entry;
      // use
    } else {
      if (entry.jspm) {
        this.jspm = entry.jspm;
      }
      if (entry.npm) {
        this.npm = entry.npm;
      }

      if (entry.use) {
        this.use = entry.use;
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
      console.log('Aurelia configured to use plugin:', this.fullName);
    });  
  }

  ensurePluginsFile() {
    const jsFile = './src/plugins.js';
    const tsFile = './src/plugins.ts';
    this.pluginsFile = fileAt(jsFile) || fileAt(tsFile);

    if (!this.pluginsFile) {
      console.log(`Creating missing plugins.js file. Use it from main.ts`);      
      try {
        let sourceFile = path.join(__dirname, 'templates', 'plugins.js');
        fs.copySync(sourceFile, jsFile);
        this.pluginsFile = jsFile;
      } catch (err) {
        console.error('Error creating plugins config file: plugins.js');        
      }
    }    
  }  

  get useLine() {
    return `aurelia.use.plugin('${this.fullName}');\n`
  }

  addUse(done) {
    if (!fileAt(this.pluginsFile)) {
      console.error('Error:', this.pluginsFile, 'not found');
    }
    fs.readFile(this.pluginsFile, 'utf8', (err, data) => {
      if (err) {
        console.error('Read error:', this.pluginsFile, err);
        done(err);
      }

      let reg = new RegExp(_.escapeRegExp(this.useLine));
      if (data.match(reg)) {
        console.error('Aborting: plugin is already used');
        process.exit(1);
      }

      let newData = data.replace(/\/\/ more plugins here/, `${this.useLine}  // more plugins here`);


      fs.writeFile(this.pluginsFile, newData, 'utf8', (err, data) => {
        if (err) {
          console.error('Write error:', this.pluginsFile, err);
          done(err);
        }
        done();
      })
    })
  }
}

// TODO: Allow for customization
// later should  (perhaps?) be moved to plugin itself...
class AuthPlugin {
  install() {
  }

  get use() {
    return `.plugin('aurelia-auth', (baseConfig)=>{
         baseConfig.configure(config);
    });`
  }
}

class MaterializePlugin {
  install() {
  }

  get use() {
    return fs.readFileSync(___dirname, 'templates/materialize.js');
  }
}