// generates an app Layout
const log = require('../log');
const c = log.c;
const generateLayout = require('./utils');
const Layouter = require('./layouter');

// for an app in multi page src layout
module.exports = class SrcLayout extends Layouter {
  constructor(layout) {
    super(layout);
  }
  
  generate() {
    log.info(`creating ${this.layout} src app layout`);

    generateLayout('./src', this.srcLayoutSpec);
  }
}