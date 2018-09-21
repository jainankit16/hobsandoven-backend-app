'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var app = (module.exports = loopback());
var logger = require('../common/lib/app-logger');

require('events').EventEmitter.prototype._maxListeners = 100;

app.start = function () {
  // start the web server
  return app.listen(function () {
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err;
  // if we are running loopback as our server
  if (require.main === module) {
    app.use(loopback.token({}));
    app.use(function updateToken(req, res, next) {
      // get the accessToken from the json-ified request
      var token = req.accessToken;
      // if there's no token we use next() to delegate handling back to loopback
      if (!token) return next();
      // performance optimization, we do not update the token more often than once per five seconds
      var now = new Date();
      if (now.getTime() - token.created.getTime() < 5000) return next();
      // save to db and move on
      token.updateAttribute('created', now, next);
    });
    app.start();
  }
});
