'use strict';

var logger = require('../../common/lib/app-logger');

module.exports = function (options) {

  return function logError(err, req, res, next) {
    if (!req.accessToken) {
      err.code = 'TOKEN_EXPIRED';
      err.name = 'Session Timeout';
    }

    if (err) {
      const errLog = Object.assign({}, err);
      errLog.info = {
        'IP': req.ip,
        'Host': req.headers['host'],
        'HostName': req.hostname,
        'Origin': req.headers['origin'],
        'Referer': req.headers['referer'],
        'Token': req.headers['authorization'],
        'RequestedUrl': req.originalUrl,
        'Method': req.method,
        'Protocol': req.protocol
      };
      logger.error(errLog);
    }

    next(err);
  };

};
