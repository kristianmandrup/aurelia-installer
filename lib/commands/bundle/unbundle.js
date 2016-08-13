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
const VendorLibraryBundler = require('../vendor');

const mergeVendorBundleConfig = require('../utils').mergeVendorBundleConfig;

module.exports = class ComponentUnBundler {
  constructor(componentsPath) {
    this.registry = new Registry();
    this.componentsPath = componentsPath || this.registry.componentsPath;
  }

  uninstallTypings() {

  }

  uninstallVendorBundles() {
    
  }
}
