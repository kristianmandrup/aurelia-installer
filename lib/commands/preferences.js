const log = require('./log');
const c = log.c;
const jsonfile = require('jsonfile')
const aureliaConfigFilePath = './aurelia_project/aurelia.json';

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

  get language() {
    switch (this.transpiler) {
      case 'typescript': return 'ts';
      default: return 'js';
    }
  }

  get transpiler() {
    return this.config.transpiler.id;
  }  
}