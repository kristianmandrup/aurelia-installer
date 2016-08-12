const inquirer = require('inquirer');
const questions = require('./questions');

module.exports = class AppManager {
  constructor() {    
  }

  execute(name) {
    this.askSubApps(apps => {
      this.apps = apps;

      this.askApp(appAnswers => {
        this.app = appAnswers;
        console.log('ALL answers', this.apps, this.app);
      });
    })
  }

  askSubApps(done) {
    inquirer.prompt(questions.subApps).then(answers => {
      if (answers.hasSubApps) {
        this.askApps(apps => {
          done(apps);
        })
      }
    });
  }

  askApps(done) {    
    inquirer.prompt(questions.apps).then(answers => {      
      let apps = answers.apps
      let extraApps = answers.extraApps;
      if (extraApps.match(/w+/)) {
        extraApps = extraApps.split(/,/)        
      }      
      if (extraApps.length) {
        apps = apps.concat(extraApps);
      }
      done(apps);
    });    
  }

  askApp(done) {
    if (process.env.AURELIA_APP) {
      return this.askLayout({app: process.env.AURELIA_APP}, done);
    } else {
      let start = questions.start(this.apps);

      inquirer.prompt(start).then(answers => {
        this.askLayout({app: answers.appName}, done);      
      });    
    }
  }

  askLayout(app, done) {
    inquirer.prompt(questions.layout).then(answers => {
      app = Object.assign(app, answers)
      done(app);
    });                  
  }
}