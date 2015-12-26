'use strict';

var validator = require('is-my-json-valid/require')
var locationValidate = validator('locationSchema.json', {
  verbose: true,
  greedy: true
});

module.exports.locationValidate = function(location) {
  return locationValidate(location);
}

module.exports.locationValidate.errors = function(location) {
  return locationValidate.errors;
}
