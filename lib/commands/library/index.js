const mergeVendorBundleConfig = require('../utils').mergeVendorBundleConfig;
const aureliaConfigFilePath = './aurelia_project/aurelia.json';
const log = require('../log');
const c = log.c;
const replace = require('replace-in-file');
const Preferences = require('../preferences');
const InstallTypings = require('../typings');
const ComponentUnBundler = require('../bundle/unbundle'); 

class LibInstaller {
  constructor(name) {
    this.name = name;
  }
}

class jQuery extends LibInstaller {
  constructor(name, prefs) {
    super(name);
    this.prefs = prefs;
  }

  configure() {
    if (this.prefs.packageManager !== 'jspm') return; 

    let filePath = path.join(__dirname, 'systemjs/jquery.js');

    let systemConfig = fs.readFileSync(filePath, 'utf8');
    replace({
      files: './index.html',
      replace: /System.import\('aurelia-bootstrapper'\);?/g,
      with: systemConfig
    }, (err, changedFiles) => {
      if (err) {
        log.error('Unable to automatically configure System.js for jQuery');
      } else {
        log.success('Successfully configured System.js for jQuery in index.html');
      }
    })
  }
}

const customInstallers = {
  jquery: jQuery
};

const registry = require('../../../registry/vendor-libs.json');

module.exports = class VendorLibraryBundler {
  constructor() {
    this.preferences = new Preferences();
  }

  get packageManager() {
    return this.preferences.packageManager;
  }  

  unbundle(name, done) {
    this.name = name;
    const libConfig = registry[name];

    if (!libConfig) {
      console.error(c.error('Vendor library'), c.important(name), c.error('is not in registry')); 
      log.info('Please update registry/vendor-libs.json at github.com/kristianmandrup/aurelia-installer');
      process.exit(1);
    } else {
      log.info(name);
      new ComponentUnBundler().removeLib(libConfig, name);
      done();
    }    
  }

  bundle(name, done) {
    this.name = name;
    const source = registry[name];
    if (!source) {
      console.error(c.error('Vendor library'), c.important(name), c.error('is not in registry')); 
      log.info('Please update registry/vendor-libs.json at github.com/kristianmandrup/aurelia-installer');
      process.exit(1);
    } else {
      log.info(name);
      mergeVendorBundleConfig(aureliaConfigFilePath, source);
      this.install();
      new InstallTypings(name).install(() => {
        log.info(`Typings installed for ${name}`);
      })
      done();
    }
  }

  install() {
    let customInstaller = customInstallers[this.name];
    if (customInstaller) {
      let installer = new customInstaller(this.name, this.preferences);
      installer.configure();
    }
  }
}

