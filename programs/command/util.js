const _ = require('lodash');

exports.normalize = function(names) {
  return _.flatten(names.map(name => _.trim(name)));
}