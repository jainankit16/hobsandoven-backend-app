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
    app.start();
  }
});
