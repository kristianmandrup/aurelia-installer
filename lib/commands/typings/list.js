const registry = require('../../../registry/typings.json');
 
module.exports = class TypingsList {
  constructor() {
  }

  list() {
    let items = Object.keys(registry);
    for (let name of items) {
      console.log(name);
    }    
  }
}