"use strict";

const util = require('util');
const _ = require('lodash');
const jsonfile = require('jsonfile')
const fs = require('fs');
const path = require('path');
const log = require('../log');
const c = log.c;
const sort = require('sort-json');
const aureliaConfigFilePath = './aurelia_project/aurelia.json';
const Registry = require('../registry');
const Preferences = require('../preferences');
const InstallTypings = require('../typings');
const VendorLibraryBundler = require('../library');
const inquirer = require('inquirer');
const mergeVendorBundleConfig = require('../utils').mergeVendorBundleConfig;

const libRegistry = require('../../../registry/vendor-libs.json');

const questions = [{
  name: 'remove',
  message: 'Remove vendor bundles as well?',
  type: 'confirm',
  default: false
}];

module.exports = class ComponentUnBundler {
  constructor(componentsPath) {
    this.registry = new Registry();
    this.componentsPath = componentsPath || this.registry.componentsPath;
  }

  // source must be a filePath to a json file or an Object
  removeDependencies(componentDependencies = [], name) {
    name = name || this.name;
    // if only one, put in a list
    if (typeof componentDependencies === 'string') {
      componentDependencies = [componentDependencies];
    }

    if (_.isEmpty(componentDependencies)) {
      log.info(`ABORT: No dependencies to unbundle found for ${name}`);
      return;
    }

    try {
      let aureliaConfig = jsonfile.readFileSync(aureliaConfigFilePath);
      let vendorBundleConfig = aureliaConfig.build.bundles[1];
      let dependencies = vendorBundleConfig.dependencies; 

      let filteredDependencies = dependencies; 
      // TODO: extract to function
      for (let dependency of componentDependencies) {

        const objDep = JSON.stringify(dependency);

        const matchers = {
          object: function(obj) { return JSON.stringify(obj) !== objDep },
          string: function(name) { return name !== dependency }
        } 

        let matcherName = typeof dependency;
        let matcher = matchers[matcherName];

        filteredDependencies = _.filter(filteredDependencies, matcher);      
      }

      // clone aurelia.json config object
      let newConfig = Object.assign({}, aureliaConfig);

      // set filtered dependencies on clone
      newConfig.build.bundles[1].dependencies = filteredDependencies;

      // write new configuration filtered by 
      jsonfile.writeFileSync(aureliaConfigFilePath, newConfig, {spaces: 2});

      log.success(`bundled libs for ${name} removed from vendor-bundle.js`);
    } catch (e) {
      log.error('Error: operating on aurelia.json. Reverting to previous version ;{}', e);
      // jsonfile.writeFileSync(targetPath, aureliaConfig, {spaces: 2});        
    }
  } 

  unbundle(name) {
    this.name = name;
    inquirer.prompt(questions).then(answers => {      
      if (answers.remove) {
        return this.removeVendorBundles();
      } else {
        log.info('Not removing vendor bundles for:', name)
      }
    })    
  }

  get installConfig() {
    if (this._installConfig) return this._installConfig;

    const srcPath = this.registry.componentLocation(this.name);
    if (!srcPath) {
      throw `Component ${this.name} is not registered in component registry: installer.json`;
    }

    try {
      let installPath = path.join(srcPath, 'install.json');
      return this._installConfig = jsonfile.readFileSync(installPath);      
    } catch (e) {
      throw `Install.json for ${this.name} could not be read for dependencies to unbundle`;
    }    
  }

  get componentDependencies() {
    const installConfig = this.installConfig;
    const dependencies = installConfig.dependencies || [];

    const bundleDeps = installConfig.bundles || [];
    const expandedBundleDeps = bundleDeps.map(dep => {
      return libRegistry[dep].dependencies;
    })

    const fullList = _.uniq(_.flatten(installConfig.dependencies.concat(expandedBundleDeps)));

    return fullList;
  }

  get componentPrepends() {
    return this.installConfig.prepend || [];
  }

  removeVendorBundles() {
    this.removeDependencies(this.componentDependencies);
    this.removePrepends(this.componentPrepends);
    this.registry.markAsUnBundled(this.name);
  }

  removeLib(libConfig, name) {
    this.removeDependencies(libConfig.dependencies, name);
    this.removePrepends(libConfig.prepend, name);
  }  
}
