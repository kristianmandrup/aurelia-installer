"use strict";

const _ = require('lodash');
const jsonfile = require('jsonfile')
const path = require('path');
const ejs = require('ejs');
const slug = require('slug');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const classify = require('underscore.string/classify');
const ComponentRegistry = require('../registry');
const Preferences = require('../preferences');

function assemble(templatePath, data) {
  const fullPath = path.join(__dirname, templatePath);
  try {
    const template = fs.readFileSync(fullPath, 'utf-8');
    return ejs.render(template, data);  
  } catch (e) {
    console.error('Template error:', fullPath, e);
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
    this.preferences = new Preferences();
  }

  get ctx() {
    return {
      name: this.name,
      className: this.className,
      description: 'todo',
      author: 'todo',
      account: 'todo',
      keywords: ['abe', 'beta'],
      repoName: this.name,
      ext: this.preferences.jsFileExt
    };
  }

  at(mountPath) {
    this._mountPath = mountPath;
    return this; 
  }

  get mountPath() {
    return path.join('src', this._mountPath) || this.componentsPath; 
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
    try {
      this.templateFile(path.join('component', templatePath), destinationPath);
    } catch (e) {
      console.error('ERROR: componentFile', e);
    }
    
  }

  create() {
    this.questions = require('./questions');

    // prompt for Webpack or Jspm preference 
    // http://ilikekillnerds.com/2016/03/ditching-jspmsystem-js-webpack/

    const vmName = this.name; // or index ?

    inquirer.prompt(this.questions).then(answers => {
      console.log('creating component:', vmName, 'at', this.destinationFolder);

      if (answers.hasView) {
        this.componentFile('index.html', `${vmName}.html`);        
      }

      this.componentFile('index.js', `${vmName}.js`);

      this.componentFile('package.json_', 'package.json');
      this.componentFile('install.json');
      this.componentFile('Readme.md');
      this.componentFile('_gitignore', '.gitignore');

      this.createIndex();
    });  
  }

  // TODO: check file not there!
  createIndex() {
    this.templateFile('index.js', '../index.js');
  }  
}