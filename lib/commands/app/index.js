const inquirer = require('inquirer');
const questions = require('./questions');
const Registry = require('../registry');
const SrcLayout = require('./src-layout');

module.exports = class AppManager {
  constructor() {
    this.registry = new Registry();
  }

  execute(name) {
    this.askSrcLayout(layout => {
      this.registry.write({
        srcLayout: layout
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