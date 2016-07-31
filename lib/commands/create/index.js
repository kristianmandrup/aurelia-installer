"use strict";

const _ = require('lodash');
const jsonfile = require('jsonfile')
const path = require('path');
const ejs = require('ejs');
const slug = require('slug');
const fs = require('fs-extra');
const classify = require('underscore.string/classify');
const ComponentRegistry = require('../registry');
const Preferences = require('../preferences');

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

questions.create = [{
  name: 'hasView',
  message: 'Is it a view component?',
  type: 'confirm',
  default: true
}];

module.exports = class ComponentCreator {
  constructor(componentsPath) {
    this.registry = new ComponentRegistry();
    this.componentsPath = componentsPath || this.registry.componentsPath;
    this.preferences = new Preferences();
  }

  get ctx() {
    return {
      name: this.name,
      className: this.className,
      description: 'todo',
      author: 'todo',
      account: 'todo',
      repoName: this.name,
      ext: this.preferences.jsFileExt
    };
  }

  at(mountPath) {
    this._mountPath = mountPath;
    return this; 
  }

  view(hasView) {
    this.hasView = hasView; 
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

  componentFile(templatePath, destinationPath) {
    this.templateFile(path.join(templatePath, 'component'), destinationPath);
  }

  create() {
    this.componentFile('view.html', `${this.name}.html`);
    if (this.hasView) {
      this.componentFile('viewModel.js', `${this.name}.js`);
    }
    
    this.componentFile('package.json_', 'package.json');
    this.componentFile('bundles.json');
    this.componentFile('Readme.md');
    this.componentFile('_gitignore', '.gitignore');

    this.createIndex();  
  }

  // TODO: check file not there!
  createIndex() {
    this.templateFile('index.js', 'index.js');
  }  
}