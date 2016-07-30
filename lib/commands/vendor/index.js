const mergeVendorBundleConfig = require('../utils').mergeVendorBundleConfig;
const aureliaConfigFilePath = './aurelia_project/aurelia.json';
const log = require('../log');
const c = log.c;
const replace = require('replace-in-file');

module.exports = class VendorBundler {
  constructor() {
  }

  bundle(name) {
    const registry = require('../../../lib-registry.json');
    const source = registry[name];
    if (!source) {
      console.error(c.error('Vendor library'), c.important(name), c.error('is not in registry')); 
      log.info('Please update lib-registry.json at github.com/kristianmandrup/aurelia-installer');
      process.exit(1);
    }
    mergeVendorBundleConfig(aureliaConfigFilePath, source);
  }

  if (customInstallers[name]) {
    let installer = new customInstallers[name](name);
    installer.configure();
  }
}

class LibInstaller {
  constructor(name) {
    this.name = name;
  }
}

class jQuery extends LibInstaller {
  constructor(name) {
    super(name);
  }

  configure() {
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
