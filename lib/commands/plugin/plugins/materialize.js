module.exports = class MaterializePlugin extends UsePlugin {
  constructor(fullName) {
    super(fullName);
  }
  
  get useLine() {
    let sourcePath = path.join(__dirname, '../templates/materialize.js');
    return fs.readFileSync(sourcePath, 'utf8');
  }
}
