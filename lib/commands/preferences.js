const log = require('./log');
const c = log.c;
const jsonfile = require('jsonfile')
const aureliaConfigFilePath = './aurelia_project/aurelia.json';
const fileAt = require('../utils').fileAt;

module.exports = class Preferences {
  constructor() {    
  }

  // read prefs from aurelia.json
  load() {
    try {
      return jsonfile.readFileSync(aureliaConfigFilePath);
    } catch (err) {
      log.error('Error: Unable to read ', aureliaConfigFilePath);
    }    
  }

  // return the aurelia.json object
  get config() {
    this._config = this._config || this.load(); 
  }

  get jsFileExt() {
    switch (this.language) {
      case 'typescript': return 'ts';
      default: return 'js';
    }
  }

  get hasTsConfig() {
    return fileAt('./tsconfig.json');
  }

  get language() {
    return this.transpiler === 'typescript' || useTypeScript ? 'typescript' : 'javascript';   
  }

  get useTypeScript() {
    return this.hasTsConfig;
  }  

  get transpiler() {
    return this.config.transpiler ? this.config.transpiler.id : null;
  }  
}