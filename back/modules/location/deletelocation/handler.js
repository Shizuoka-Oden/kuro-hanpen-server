'use strict';

/**
 * Serverless Module: Lambda Handler
 * - Your lambda functions should be a thin wrapper around your own separate
 * modules, to keep your code testable, reusable and AWS independent
 * - 'serverless-helpers-js' module is required for Serverless ENV var support.  Hopefully, AWS will add ENV support to Lambda soon :)
 */

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Require Logic
var esRequest = require('../lib/esRequest');

// Lambda Handler
module.exports.handler = function(event, context) {
  var id = event.locationId;
  if (!id) {
    return context.done(new Error('invalid id. ' + id));
  }

  esRequest.getLocation(id)
  .then(function(response) {
    if (!response.found) {
      throw new Error('invalid id. not found. ' + id);
    }
    if (response._source.type != 'ヒヤリハット' || response._source.preset) {
      throw new Error('invalid id. type is not ヒヤリハット or preset data. ' + id);
    }
    return esRequest.deleteLocation(id)
  })
  .then(function(response) {
    return context.done(null, {});
  })
  .catch(function(err) {
    console.log(err);
    return context.done(err);
  });
};