export default (config) => {
  /* configure aurelia-authentication */
  config.plugin('aurelia-authentication', baseConfig => {
      baseConfig.configure(authConfig);
  });