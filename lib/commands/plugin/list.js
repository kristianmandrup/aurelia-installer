// list plugins in registry

// lookup each plugin in registry and use `npm view <plugin>`
// to describe it and categorize it

// Another method: https://github.com/anvaka/npmrank/tree/master/online

// http://stackoverflow.com/questions/13657140/how-to-get-all-npm-packages-that-match-a-particular-keyword-in-json-format

// https://registry.npmjs.org/-/_view/byKeyword?startkey=["keyword"]&endkey=["keyword",{}]&group_level=3

// npm install npm-keywordsearch

// https://github.com/solids/npmsearch

// var search = require('npm-keywordsearch')

// TODO: ask for plugins to add this keyword!

// search('aurelia-plugin', function (error, packages) {
//   packages.forEach(function (pkg) {
//     console.log(pkg.name + ': ' + pkg.description)
//   })
// })

const pluginRegistry = require('../../../registry/plugins.json');
 
module.exports = class PluginList {
  constructor() {
  }

  list() {
    let plugins = Object.keys(pluginRegistry);
    for (let name of plugins) {
      console.log(name);
    }    
  }
}