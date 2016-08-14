// const Git = require("nodegit");
const Git = require('simple-git')

module.exports = class GitWorkflow {
  constructor() {   
  }

  commit(message) {
    return Git
      .add('./*')
      .commit(message)
  }
}