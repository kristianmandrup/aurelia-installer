// const log = require('../log');
// const c = log.c; 
const inquirer = require('inquirer');
const questions = require('./questions');
const fs = require('fs-extra');

function templatePath(fileName) {
  return path.join(__dirname, 'templates', fileName);
}

function insertAfter(fileName, where, insertionCode) {
  try {
    const filePath = path.join(__dirname, fileName);
    let fileContent = fs.readFileSync(filePath, 'utf-8');
    const insertionPoint = new Regexp.escape(where);
    fileContent = fileContent.replace(insertionPoint, where + insertionCode);
    fs.writeFileSync(fileContent);
  } catch (e) {
    console.error('ERROR: inserting ', insertionCode, 'after', where);
  }
}

module.exports = class Manifest {
  constructor() {}

  assemble(name, data) {
    const fullPath = templatePath(name);
    try {
      const template = fs.readFileSync(fullPath, 'utf-8');
      return ejs.render(template, data);  
    } catch (e) {
      console.error('Template error:', fullPath, e);
    }
  }

  create() {
    inquirer.prompt(questions).then(answers => {
      try {
        let fileName = 'manifest.json';
        let manifest = this.assemble(fileName);
        fs.writeFileSync(fileName, manifest);
      } catch (e) {
        console.error('ERROR: create manifest', fileName, e);
      }          
    })
  }

  copy() {
    let srcPath = path.join(__dirname, 'manifest');
    fs.copySync(srcPath, './manifest');

    let offlinePage = path.join(__dirname, 'templates/offline.html');
    fs.copySync(offlinePage, './offlin.html');

    console.log('You must add /manifest files to "prepend" section of test and production builds in aurelia.json')
  }

  // these files must be prepended app for production and test and builds only

  // Manifest generator:
  // http://brucelawson.github.io/manifest/

  // Validator: https://manifest-validator.appspot.com/

  // Server over https: https://letsencrypt.org/

  // See: 
  
  // https://addyosmani.com/blog/getting-started-with-progressive-web-apps/
  // https://www.smashingmagazine.com/2016/08/a-beginners-guide-to-progressive-web-apps/

  // TEST
  // npm install -g GoogleChrome/lighthouse

  // Add the manifest.json reference to the index.html file’s head tag:
  addManifest() {
    insertAfter('index.html', '<head>', '<link rel="manifest" href="./manifest.json">');
  }
}