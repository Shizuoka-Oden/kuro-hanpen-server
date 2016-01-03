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

  esRequest.aggsAuthorCount()
  .then(function(response) {
    return context.done(null, response.aggregations.type.buckets);
  })
  .catch(function(err) {
    return context.done(err, null);
  });
};