module.exports = class GitWorkflow {
  constructor() {    
  }

  commit(message) {
    console.log('git commit -am ', message);
  }
}