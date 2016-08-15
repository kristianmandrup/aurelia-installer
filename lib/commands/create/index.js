"use strict";

const _ = require('lodash');
const jsonfile = require('jsonfile')
const path = require('path');
const ejs = require('ejs');
const slug = require('slug');
const fs = require('fs-extra');
const f = require('fs');
const log = require('../log');
const c = log.c;

const inquirer = require('inquirer');

const classify = require('underscore.string/classify');
const Registry = require('../registry');
const Preferences = require('../preferences');

function assemble(templatePath, data) {
  const fullPath = path.join(__dirname, templatePath);
  try {
    const template = fs.readFileSync(fullPath, 'utf-8');
    return ejs.render(template, data);  
  } catch (e) {
    throw `Template error: ${fullPath}`;
  }
}

function templateFile(templatePath, destinationPath, data) {
  let fileContent = assemble(templatePath, data);
  let destFolder = path.dirname(destinationPath);
  // console.log(fileContent);
  try {
    fs.writeFileSync(destinationPath, fileContent);
  } catch (e) {
    throw `Template write error: ${templatePath} -> ${destinationPath}`;
  }
}

module.exports = class ComponentCreator {
  constructor(componentsPath) {
    this.registry = new Registry();
    this.componentsPath = componentsPath || this.registry.componentsPath;
    this.preferences = new Preferences();
  }

  get registryConfig() {
    return this.registry.read();
  }

  get baseCtx() {
    return {
      name: this.name,
      className: this.className,
      repoName: this.name,
      account: this.registryConfig.gitAccount, 
      ext: this.preferences.jsFileExt
    };
  }

  setCtx(answers) {    
    let keywords = answers.keywords;
    keywords = keywords.match(/w+/) ? keywords.split(/,/) : [];     
    console.log(keywords);
    keywords.unshift('aurelia-component'); 
    answers.keywords = keywords;
    
    console.log(answers);
    this.ctx = Object.assign(this.baseCtx, answers);
  }

  at(mountPath) {
    this._mountPath = mountPath;
    return this; 
  }

  get appPath() {
    return this.registry.appPath;
  }

  get mountPath() {
    return path.join(this.appPath, this._mountPath) || this.componentsPath; 
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
      throw `ERROR: componentFile: ${templatePath}`;
    }
    
  }

  create() {
    this.questions = require('./questions');

    // prompt for Webpack or Jspm preference 
    // http://ilikekillnerds.com/2016/03/ditching-jspmsystem-js-webpack/

    const vmName = this.name; // or index ?

    inquirer.prompt(this.questions).then(answers => {
      console.log('creating component:', vmName, 'at', this.destinationFolder);

      this.setCtx(answers);

      // TODO: put in utils!
      try {
        let stats = f.statSync(this.destinationFolder);
        if (!stats) {
          fs.mkdirsSync(this.destinationFolder);
        } else {
          // TODO: allow overwrite?
          if (stats.isDirectory()) {
            throw `component already exists at ${this.destinationFolder}`;
          }
        }
      } catch (e) {
        if (e.code === 'ENOENT') {
          fs.mkdirsSync(this.destinationFolder);
        } else {
          throw `ERROR: creating component folder ${this.destinationFolder}`;
        }
      }
      
      if (answers.hasView) {
        this.componentFile('index.html', `${vmName}.html`);        
      }

      this.componentFile('index.js', `${vmName}.${this.ctx.ext}`);

      this.componentFile('package.json_', 'package.json');
      this.componentFile('install.json');
      this.componentFile('Readme.md');
      this.componentFile('_gitignore', '.gitignore');

      this.createIndex();
      done();
    });  
  }

  // TODO: check file not there!
  createIndex() {
    this.templateFile('index.js', '../index.js');
  }  
}