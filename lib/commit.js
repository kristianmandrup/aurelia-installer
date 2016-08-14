const Registry = require('./commands/registry');
const GitWorkflow = require('./git-workflow');
const registry = new Registry();
const enabled = this.registry.gitWorkflow; 

module.exports = function (message) {
  if (!enabled) return;
  return new GitWorkflow().commit(message);
}
