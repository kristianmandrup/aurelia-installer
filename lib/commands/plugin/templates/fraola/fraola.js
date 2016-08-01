export default (config) => {
    config.plugin('aurelia-froala', config => {
        // Load plugins 
        config.addPlugin("colors");
        config.addPlugin("align");
        config.addPlugin("code_beautifier");
        config.addPlugin("image") // The image_manager plugin depends on the image plugin, so the former needs to loaded after the latter. 
            .then(() => config.addPlugin("image_manager"));
    })
}