const Registry = require('./commands/registry');
const GitWorkflow = require('./git-workflow');
const registry = new Registry();
const enabled = this.registry.gitWorkflow; 

function command(cmd, done) {
  try {
    cmd();
    done();
  } catch (err) {
    done(err);
  }  
}

module.exports = function commitCmd(message, cmd) {
  command(name, () => { cmd }, (err) => {
    if (!err) {
      commit(message);
    }
  })
}                

function commit(message) {
  if (!enabled) return;
  return new GitWorkflow().commit(message);
}
