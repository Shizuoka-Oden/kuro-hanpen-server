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
  // クエリチェック
  if (event.type)  {
    var types = event.type.split(',');

    var VALID_TYPES = ['幼稚園', '保育園', '小学校', '中学校', '高校', '公園', 'ヒヤリハット'];
    for (var i = 0; i < types.length; i++) {
      if (VALID_TYPES.indexOf(types[i]) === -1) {
        return context.done(new Error("invalid type " + types[i]));
      }
    }
  }

  esRequest.searchLocations(types)
  .then(function(response) {
    return context.done(null, response);
  })
  .catch(function(err) {
    return context.done(err, null);
  });
};