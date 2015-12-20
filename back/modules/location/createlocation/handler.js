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
var lib = require('../lib');

// Lambda Handler
module.exports.handler = function(event, context) {
  var response = {
    "_id": "zzzzzzzzz",
    "type": "ヒヤリハット",
    "address": "葵区追手町９−６",
    "location": {
      "lat": 34.9738584,
      "lon": 138.3851473
    },
    "title": "静岡県庁",
    "description": "詳細情報画面に表示する説明文",
    "preset": false
  };
  return context.done(null, response);

  // lib.respond(event, function(error, response) {
  //   return context.done(error, response);
  // });
};