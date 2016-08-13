// generates an app Layout
const _ = require('lodash');
const jsonfile = require('jsonfile')
const fs = require('fs-extra');
const path = require('path');
const log = require('../log');
const c = log.c;
const generateLayout = require('./utils');
const Layouter = require('./layouter');

// for an app in multi page src layout
module.exports = class AppLayout extends Layouter {
  constructor(name, layout) {    
    super(layout);
  }
    
  get multi() {
    return this.registry.srcLayout === 'multi';
  }

  generate() {  
    log.info(`creating ${this.layout} layout for ${this.name} app`);
    const basePath = this.multi ? './src/apps' : './src';
    const appPath = path.join(basePath, this.name); 
    generateLayout(basePath, this.srcLayoutSpec);
  }
}