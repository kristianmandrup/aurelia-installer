"use strict";

const jsonfile = require('jsonfile')
const _ = require('lodash');
const log = require('./log');

// source must be a filePath to a json file or an Object
function mergeVendorBundleConfig(targetPath, source) {
  try {
    // console.log('Merging', targetPath, sourcePath);
    let targetConfig = jsonfile.readFileSync(targetPath);
    let sourceConfig = source;

    if (typeof source === 'string') {
      sourceConfig = jsonfile.readFileSync(sourcePath);
    } 
     
    let vendorBundleConfig = targetConfig.build.bundles[1];
    vendorBundleConfig = concatUniqKeys(vendorBundleConfig, sourceConfig, ['dependencies', 'prepend']);
    // clone
    let newConfig = Object.assign({}, targetConfig);

    newConfig.build.bundles[1] = vendorBundleConfig;

    jsonfile.writeFile(targetPath, newConfig, {spaces: 2}, (err) => {
      if (err) {
        log.error('write error', targetPath, newConfig['build']['bundles'][1], err);
        process.exit(1);
      }
    });
  } catch (e) {
    log.error('Error', e);
  }
}

function concatUniq(target, source, key) {
  if (source[key]) {
    target[key] = target[key].concat(source[key]);
    target[key] = _.uniqBy(target[key], (item) => {
      return item.name || item;
    });
  } else {
    // no such key
  }
  return target;
}

function concatUniqKeys(target, source, keys) {
  if (Array.isArray(keys)) {
    keys.forEach(key => {
      target = concatUniq(target, source, key)
    })
    return target;
  } else {
    return concatUniq(target, source, key);
  }
}


module.exports = {
  mergeVendorBundleConfig: mergeVendorBundleConfig
}