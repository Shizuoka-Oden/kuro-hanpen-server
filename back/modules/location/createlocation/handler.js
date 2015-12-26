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
var validator = require('../lib/validator');

// Lambda Handler
module.exports.handler = function(event, context) {

  var location = {
    type: event.type,
    address: event.address,
    location: event.location,
    title: event.title,
    description: event.description,
    preset: false
  };

  if (!validator.locationValidate(location)) {
    console.log(validator.locationValidate.errors());
    return context.done(
      new Error("invalid request : " + JSON.stringify(validator.locationValidate.errors()))
    );
  }

  esRequest.createLocations(location)
  .then(function(response) {
    console.log(JSON.stringify(response));
    location._id = response._id;
    return context.done(null, location);
  })
  .catch(function(err) {
    console.log(err);
    return context.done(err);
  });

};