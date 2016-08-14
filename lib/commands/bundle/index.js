"use strict";

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

const mergeVendorBundleConfig = require('../utils').mergeVendorBundleConfig;

module.exports = class ComponentBundler {
  constructor(componentsPath) {
    this.registry = new Registry();
    this.componentsPath = componentsPath || this.registry.componentsPath;
  }

  bundle(file, done) {
    try {
      file ? this.bundleOne(file, done) : this.bundleAll(done);
      done();
    } catch (e) {
      done(e);
    }    
  }

  bundleAll(done) {
    // Loop through all the folders in the src/components directory
    let files = fs.readdirSync(this.componentsPath, 'utf8');
    files.forEach(this.bundleOne.bind(this));
    console.log('To install component dependencies, please run:', c.important('npm install')); 
  }

  bundleOne(file) {
    let filePath = path.join(this.componentsPath, file);
    let stat = fs.statSync(filePath);
    if( stat.isDirectory() ) {
      new Component(filePath).install();
    }
  }
}

class Component {
  constructor(filePath) {
    this.filePath = filePath;
    this.name = path.basename(filePath);
    this.preferences = new Preferences();
  }

  install() {
    console.log(c.info('Installing '), c.important(this.name));

    this.mergeAureliaConfig();
    this.mergePackageDependencies();
    this.installTypings();
    this.installBundles();
    this.registry.markAsBundled(this.name);

    log.success(this.name + '✓');
  }

  get installConfig() {
    return path.join(this.filePath, 'install.json');
  }

  mergeAureliaConfig() {
    console.log('configuring aurelia.json vendor bundles');    
    mergeVendorBundleConfig(aureliaConfigFilePath, this.installConfig);
  }

  get bundler() {
    return this._bundler = new VendorLibraryBundler();
  }

  installBundles() {
    let bundles = this.config.bundles;
    if (!bundles) return;

    console.log('installing bundles...');
    
    for (let name of bundles) {
      this.bundler.bundle(name)
    }    
  }

  get config() {
    return this._config = this._config || jsonfile.readFileSync(this.installConfig);  
  }

  installTypings() {
    if (!this.preferences.useTypeScript) return;

    let typings = this.config.typings;
    if (!typings) return;

    console.log('installing typings...');

    for (let typing of typings) {
      new InstallTypings(typing).install(result => {

      })
    } 
  }

  mergePackageDependencies() {
    console.log('configuring npm dependencies');
    let sourcePath = path.join(this.filePath, 'package.json');
    mergeJsonFiles('./package.json', sourcePath, {key: 'dependencies'});
  }
}

function mergeJsonFiles(targetPath, sourcePath, options = {}) {
  const targetConfig = jsonfile.readFileSync(targetPath);
  jsonfile.readFile(sourcePath, (err, sourceConfig) => {
    if (err) {
      log.error('read error', sourcePath, err);
      process.exit(1);
    }

    if (options.key) {
      let source = {}
      source[options.key] = sourceConfig[options.key]
      sourceConfig = source;
    }

    let newConfig = sort(_.merge({}, targetConfig, sourceConfig));

    jsonfile.writeFile(targetPath, newConfig, {spaces: 2}, (err) => {
      if (err) {
        log.error('write error', targetPath, newConfig, err);
        process.exit(1);
      }
    });
  });
}





