const log = require('../log');
const c = log.c;
const jsonfile = require('jsonfile')
const aureliaConfigFilePath = './aurelia_project/aurelia.json'; 
const inquirer = require('inquirer');
const ComponentRegistry = require('../registry');

module.exports = class InitProject {
  constructor(settings) {
    this.settings = settings;
    this.registry = new ComponentRegistry();
  }

  initialize() {
    this.questions = require('./questions');

    // prompt for Webpack or Jspm preference 
    // http://ilikekillnerds.com/2016/03/ditching-jspmsystem-js-webpack/

    inquirer.prompt(this.questions.init).then(answers => {
      try {
        // load aurelia.json and add a packageManager entry
        let aureliaConfig = jsonfile.readFileSync(aureliaConfigFilePath);
        aureliaConfig.packageManager = answers.packageManager;
        jsonfile.writeFileSync(aureliaConfigFilePath, aureliaConfig);

        this.registry.write({
          gitAccount: answers.gitAccount,
          componentsPath: answers.componentsPath,
        });
      } catch (err) {
        console.error(`Error: Could not access ${aureliaConfigFilePath} in your project`);
      }
    });
  }

  start() {
    // inquirer(this.questions.start, (answers) => {
    //   // ...
    // });
  }
}

