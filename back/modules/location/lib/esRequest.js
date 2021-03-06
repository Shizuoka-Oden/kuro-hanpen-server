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

// 位置情報の取得
module.exports.getLocation = function(id) {
  return this.send('GET', '/kuro-hanpen/location/' + id);
}

// 位置情報の検索
module.exports.searchLocations = function(types, sort) {
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

  if (sort) {
    body.sort = [{ "likesCount": { "order": "desc", "missing": "_last" }}, "_id"];
    body.size = 10;
    body.query.bool.must = [];
    body.query.bool.must.push( { range: { likesCount: { gte: 1 }}} );
  }

  return this.send('POST', '/kuro-hanpen/location/_search', JSON.stringify(body));
}

// 位置情報の登録
module.exports.createLocation = function(body) {
  return this.send('POST', '/kuro-hanpen/location?refresh=true', JSON.stringify(body));
}

// 位置情報の更新
module.exports.updateLocation = function(id, body) {
  return this.send('PUT', '/kuro-hanpen/location/' + id + '?refresh=true', JSON.stringify(body));
}

// 位置情報の削除
module.exports.deleteLocation = function(id) {
  return this.send('DELETE', '/kuro-hanpen/location/' + id + '?refresh=true');
}

// 作成者の集計
module.exports.aggsAuthorCount = function() {
  var body = {
    size: 0,
    query: { match_all : {}},
    aggs: {
      type: {
        terms: {
          field: "author",
          size: 10,
          order : { "_count" : "desc" }
        }
      }
    }
  };

  return this.send('POST', '/kuro-hanpen/location/_search', JSON.stringify(body));
}
