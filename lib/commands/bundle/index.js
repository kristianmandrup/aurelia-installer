"use strict";

const _ = require('lodash');
const jsonfile = require('jsonfile')
const fs = require('fs');
const path = require('path');
const log = require('../log');
const c = log.c;
const sort = require('sort-json');
const aureliaConfigFilePath = './aurelia_project/aurelia.json';
const ComponentRegistry = require('../registry');

const mergeVendorBundleConfig = require('../utils').mergeVendorBundleConfig;

module.exports = class ComponentBundler {
  constructor(componentsPath) {
    this.registry = new ComponentRegistry();
    this.componentsPath = componentsPath || this.registry.componentsPath;
  }

  bundle(file) {
    file ? this.bundleOne(file) : this.bundleAll();
  }

  bundleAll() {
    // Loop through all the folders in the src/components directory
    try {
      let files = fs.readdirSync(this.componentsPath, 'utf8');
      files.forEach(this.bundleOne.bind(this));
      console.log('To install component dependencies, please run:', c.important('npm install'));
    } catch (e) {
      log.error('bundleAll', e);
    }
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
  }

  install() {
    console.log(c.info('Installing '), c.important(this.name));
    this.mergeAureliaConfig();
    this.mergePackageDependencies();
    log.success(this.name + '✓');
  }

  mergeAureliaConfig() {
    let sourcePath = path.join(this.filePath, 'vendor-bundles.json');
    mergeVendorBundleConfig(aureliaConfigFilePath, sourcePath);
  }

  mergePackageDependencies() {
    let sourcePath = path.join(this.filePath, 'package.json');
    mergeJsonFiles('./package.json', sourcePath, {key: 'dependencies'});
  }
}

function mergeJsonFiles(targetPath, sourcePath, options = {}) {
  // console.log('Merging', targetPath, sourcePath);
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





