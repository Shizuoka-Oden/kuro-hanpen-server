'use strict';

var fs = require("fs");
var AWS = require('aws-sdk');
var Promise = require('bluebird');

var creds = new AWS.EnvironmentCredentials('AWS');

// AWSの設定ファイル読み込み
try {
  var awsConf = JSON.parse(fs.readFileSync('./aws.json'));
  if(awsConf.key && awsConf.secret) {
    creds = new AWS.Credentials();
    creds.accessKeyId = awsConf.key;
    creds.secretAccessKey = awsConf.secret;
  }

} catch(e) {
  console.log("aws.json read failed.")
}

// ESへのリクエスト実行
module.exports.send = function(method, path, body) {
  return new Promise(function(onFulfilled, onRejected) {
    var endpoint = new AWS.Endpoint("search-oden-zxymxormidqmjjdx4ubxowk5le.ap-northeast-1.es.amazonaws.com");
    var req = new AWS.HttpRequest(endpoint);
    req.region = "ap-northeast-1";
    req.headers['Host'] = endpoint.host;
    req.method = method;
    req.path = path;
    req.body = body;

    var signer = new AWS.Signers.V4(req, 'es');
    signer.addAuthorization(creds, new Date());

    var send = new AWS.NodeHttpClient();
    send.handleRequest(req, null, function(httpResp) {
      var body = '';
      httpResp.on('data', function(chunk) {
        body += chunk;
      });
      httpResp.on('end', function(chunk) {
        if(JSON.parse(body).errors || JSON.parse(body).message) {
          onRejected(body);
        }
        onFulfilled(JSON.parse(body));
      });
    }, function(err) {
      onRejected(err);
    });
  });
};

// 位置情報の検索
module.exports.searchLocations = function(types) {
  var body = {
    size: 2500,
    query: { match_all : {}}
  };

  if (types) {
    body.query = { bool: { should: [] } };
    types.forEach(function(type) {
      body.query.bool.should.push( { match: { type: { query: type }}} );
    });
  }
  return this.send('POST', '/kuro-hanpen/location/_search', JSON.stringify(body));
}
