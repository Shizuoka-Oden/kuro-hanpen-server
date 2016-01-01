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

  var user = event.user;
  var regex = new RegExp("^ap-northeast-1:[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}-_-.*$");
  if (!regex.test(user)) {
    return context.done(new Error('invalid id. user format. ' + user));
  }

  esRequest.getLocation(id)
  .then(function(response) {
    if (!response.found) {
      throw new Error('invalid id. not found. ' + id);
    }
    if (response._source.type != 'ヒヤリハット') {
      throw new Error('invalid id. type is not ヒヤリハット. ' + id);
    }

    var body = response._source;
    if (!body.likes) {
      body.likes = [];
    }
    if (body.likes.indexOf(user)>=0) {
      return context.done(null, {});
    }
    body.likes.push(user);
    return esRequest.updateLocation(id, body);
  })
  .then(function(response) {
    return context.done(null, {success:true});
  })
  .catch(function(err) {
    return context.done(err);
  });
};