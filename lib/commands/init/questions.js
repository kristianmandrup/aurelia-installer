const jsonfile = require('jsonfile')

function detectFile(filePath) {
  try {
    if (fs.statSync(filePath).isFile()) {
      return true;    
    }
    this.create();
  } catch (e) {
    console.error(`Error checking for ${filePath} file in project`)
  } 
}

const defaults = {
  webpack: detectFile('webpack.config.js'),
  jspm: detectFile('config.js'),
}

// prefer webpack over jspm
defaults.pref = function() {
  if (defaults.webpack) return 'webpack';
  return defaults.jspm ? 'jspm' : null;
}();
 
module.exports = [{
  name: 'packageManager',
  message: 'Which is your preferred package manager?',
  type: 'list',
  choices: ['Webpack', 'Jspm'],
  default: defaults.pref,
  filter: function (str){
    return str.toLowerCase();
  }
}];