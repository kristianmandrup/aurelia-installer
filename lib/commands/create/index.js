"use strict";

const _ = require('lodash');
const jsonfile = require('jsonfile')
const path = require('path');
const ejs = require('ejs');
const slug = require('slug');
const fs = require('fs-extra');
const classify = require('underscore.string/classify');
const ComponentRegistry = require('../registry');

function assemble(templatePath, data) {
  try {
    const fullPath = path.join(__dirname, templatePath);
    const template = fs.readFileSync(fullPath, 'utf-8');
    console.log('temlate', template, data);
    return ejs.render(template, data);  
  } catch (e) {
    console.error('Template error:', path, e);
  }
}

function templateFile(templatePath, destinationPath, data) {
  let fileContent = assemble(templatePath, data);
  let destFolder = path.dirname(destinationPath);
  try {
    fs.mkdirsSync(destFolder);
    fs.writeFileSync(destinationPath, fileContent);
  } catch (e) {
    console.error('Write error:', destinationPath, e);
  }
}

module.exports = class ComponentCreator {
  constructor(componentsPath) {
    this.registry = new ComponentRegistry();
    this.componentsPath = componentsPath || this.registry.componentsPath;
  }

  get ctx() {
    return {
      name: this.name,
      className: this.className
    };
  }

  at(mountPath) {
    this._mountPath = mountPath;
    return this; 
  }

  get mountPath() {
    return this._mountPath || this.componentsPath; 
  }

  named(name) {
    this.name = slug(name);
    this.className = classify(this.name);
    this.destinationFolder = path.join(this.mountPath, this.name);
    return this;
  }

  templateFile(templatePath, destinationPath) {
    destinationPath = destinationPath || path.basename(templatePath);
    let destFile = path.join(this.destinationFolder, destinationPath);
    templatePath = path.join('templates', templatePath);
    templateFile(templatePath, destFile, this.ctx)
  }

  create() {
    this.templateFile('view.html', `${this.name}.html`);
    this.templateFile('viewModel.js', `${this.name}.js`);
    this.templateFile('package.json');
    this.templateFile('vendor-bundles.json');
    this.templateFile('Readme.md');
  }
}