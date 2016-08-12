// generates an app Layout
const _ = require('lodash');
const jsonfile = require('jsonfile')
const fs = require('fs');
const path = require('path');
const log = require('../log');
const c = log.c;

const layouts = require('./layouts');

module.exports = class AppLayout {
  constructor(name, layout) {
    this.name = name;     
    this.layout = layout;   
  }

  makeLayout() {
    let layoutsPath = path.join(__dirname, 'layouts', this.layout, 'layouts.json');

    const layoutSpec = jsonfile.readFileSync(layoutsPath);

    console.log(this.name, this.layout, '>>', layoutSpec)
  }
}