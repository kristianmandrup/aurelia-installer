export default (config) => {
    config.options({
        apiKey: 'myapiKey',
        apiLibraries: 'drawing,geometry' //get optional libraries like drawing, geometry, ... - comma seperated list
    });
}