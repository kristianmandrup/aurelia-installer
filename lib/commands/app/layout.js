// generates an app Layout
const _ = require('lodash');
const jsonfile = require('jsonfile')
const fs = require('fs-extra');
const path = require('path');
const log = require('../log');
const c = log.c;
const Registry = require('../registry');
const layouts = require('./layouts');

function getLayout(layout) {
  if (typeof layout === 'string') {
    if (layout.match(/^layout:/)) {
      return layout.split(':')[1];
    } 
  } 
}

module.exports = class AppLayout {
  constructor(name, layout) {
    this.registry = new Registry();
    this.name = name || this.defaultAppName;
    layout = layouts.indexOf(layout) >= 0 ? layout : null;     
    this.layout = layout || this.defaultAppLayout || 'simple';    
  }

  get defaultAppName() {
    return this.registry.app ? this.registry.app.name : null; 
  }

  get defaultAppLayout() {
    return this.registry.app ? this.registry.app.layout : 'simple'; 
  }
  
  hasApp(name) {
    if (!this.registry.apps) return true;
    return this.registry.apps.indexOf(name) >= 0;
  }
  
  makeLayout() {
    if (!this.name) {
      log.error('no app name specified');
      return;
    }
    if (!this.hasApp(this.name)) {
      log.error(`App ${this.name} not registered as one of your apps:`, this.registry.apps);
      return;      
    }

    log.info(`creating ${this.layout} app layout`);
    let folder = path.join(__dirname, 'layouts', this.layout)
    let layoutsPath = path.join(folder, 'layouts.json');
    let srcLayoutPath = path.join(folder, 'src-layout.json');    

    this.srcLayoutSpec = jsonfile.readFileSync(srcLayoutPath);
    this.layoutSpecs = jsonfile.readFileSync(layoutsPath);

    this.traverse('./src', this.srcLayoutSpec);
  }

  traverse(basePath, layoutSpec, parentFolder) {
    for (let folder of Object.keys(layoutSpec)) {
      if (parentFolder === 'apps') {
        if (!this.hasApp(folder)) {
          log.info('skipping app layout for', folder)
          continue;
        }
      }

      let folderPath = path.join(basePath, folder);
      let layout = layoutSpec[folder];
      fs.mkdirsSync(folderPath);
      let layoutName = getLayout(layout);
      if (layoutName) {
        let layoutConfig = this.layoutSpecs[layoutName];
        this.traverse(folderPath, layoutConfig)
      } else {
        if (typeof layout === 'object') {
          this.traverse(folderPath, layout, folder);
        }
      }     
    }
  }
}