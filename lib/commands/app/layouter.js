const _ = require('lodash');
const jsonfile = require('jsonfile')
const fs = require('fs-extra');
const path = require('path');

const Registry = require('../registry');
const layouts = require('./layouts');

// abstract layout class
module.exports = class Layouter {
  constructor(layout) {
    layout = layouts.indexOf(layout) >= 0 ? layout : null;
    this.registry = new Registry();
    this.layout = layout || this.registry.defaultLayout;    

    let folder = path.join(__dirname, 'layouts', this.layout)
    let layoutsPath = path.join(folder, 'layouts.json');
    let srcLayoutPath = path.join(folder, 'src-layout.json');    

    this.srcLayoutSpec = jsonfile.readFileSync(srcLayoutPath);
    this.layoutSpecs = jsonfile.readFileSync(layoutsPath);    
  }

  get multi() {
    return this.registry.srcLayout === 'multi';
  }  
}