const inquirer = require('inquirer');
const questions = require('./questions');
const Registry = require('../registry');
const SrcLayout = require('./src-layout');

module.exports = class AppManager {
  constructor() {
    this.registry = new Registry();
  }

  execute(done) {
    this.askSrcLayout(srcLayout => {
      this.registry.write({
        defaultLayout: defaultLayout, 
        srcLayout: srcLayout
      })

      new SrcLayout(layout).generate();
      if (done) {
        return done(srcLayout);
      }      
    })
  }

  askSrcLayout(app, done) {
    inquirer.prompt(questions.srcLayout).then(answers => {
      done(answers.layout);
    });                  
  }
}