const mergeVendorBundleConfig = require('../utils').mergeVendorBundleConfig;
const aureliaConfigFilePath = './aurelia_project/aurelia.json';
const log = require('../log');
const c = log.c;

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
}