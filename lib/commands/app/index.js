const inquirer = require('inquirer');
const questions = require('./questions');
const Registry = require('../registry');
const SrcLayout = require('./src-layout');

module.exports = class AppManager {
  constructor() {
    this.registry = new Registry();
  }

  execute(name) {
    this.askSrcLayout(srcLayout => {
      this.registry.write({
        defaultLayout: defaultLayout, 
        srcLayout: srcLayout
      })

      return new SrcLayout(layout).generate();
    })
  }

  askSrcLayout(app, done) {
    inquirer.prompt(questions.srcLayout).then(answers => {
      done(answers.layout);
    });                  
  }
}