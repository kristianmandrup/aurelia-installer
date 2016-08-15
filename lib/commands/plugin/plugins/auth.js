// Allows for customization of specific plugins 

module.exports = class AuthPlugin extends UsePlugin {
  constructor(fullName) {    
    super(fullName);
  }

  get useLine() {
    return `aurelia.use.plugin('aurelia-auth', (config)=>{
    config.configure(authConfig);
  });`
  }

  postInstall() {   
    console.log('post install');    
    try {
      let fileName = 'auth-config.js';
      let sourcePath = path.join(__dirname, '../templates', fileName);
      let destPath = path.join('.src/', fileName)
      fs.copySync(sourcePath, destPath);
    } catch (err) {
      console.error('Error creating auth provider configuration file:', fileName);        
    }     

    prependFile(this.pluginsFile, "import authConfig from './auth-config'");
  }
}