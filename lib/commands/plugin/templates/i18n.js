export default (plugin) => {
        // register backend plugin
        plugin.i18next.use(Backend);

        // adapt options to your needs (see http://i18next.com/docs/options/)
        // make sure to return the promise of the setup method, in order to guarantee proper loading
        return plugin.setup({
          backend: {                                  // <-- configure backend settings
            loadPath: './locales/{{lng}}/{{ns}}.json', // <-- XHR settings for where to get the files from
          },
          lng : 'de',
          attributes : ['t','i18n'],
          fallbackLng : 'en',
          debug : false
        });
}