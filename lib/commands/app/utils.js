module.exports = function (basePath, layoutSpec, parentFolder) {
  for (let folder of Object.keys(layoutSpec)) {

    let folderPath = path.join(basePath, folder);
    let layout = layoutSpec[folder];
    fs.mkdirsSync(folderPath);
    let layoutName = getLayout(layout);
    if (layoutName) {
      let layoutConfig = this.layoutSpecs[layoutName];
      this.traverse(folderPath, layoutConfig)
    } else {
      if (typeof layout === 'object') {
        this.traverse(folderPath, layout, folder);
      }
    }     
  }
}

