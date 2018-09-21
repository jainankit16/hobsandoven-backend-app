'use strict';

var env = (process.env.NODE_ENV || 'NotSet');

module.exports = {
  remoting: {
    errorHandler: {
      handler: function (err, req, res, next) {
        // custom error handling logic
        var log = require('debug')('server:rest:errorHandler'); // example
        log(req.method, req.originalUrl, res.statusCode, err);
        next(); // call next() to fall back to the default error handler
      }
    }
  }
};

// Set API Version
var p = require('../package.json');
var version = p.version.split('.').shift();
console.log("API root path set to " + process.env.API_ROOT_PATH);
var apiRootPath = (process.env.API_ROOT_PATH || '/api' + (version > 0 ? '/v' + version : ''))

//1209600 for 2 Weeks or 7200 for 120 mins 
var ttlDefault = 7200;
var ttlRemeberMe = 1209600;

module.exports = {
  restApiRoot: apiRootPath,
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8080,
  ttl: {
    'deafult': ttlDefault,
    'rememberMe': ttlRemeberMe
  }
};
