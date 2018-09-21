'use strict';

var winston = require('winston');
var Papertrail = require('winston-papertrail').Papertrail;

var logTransports = [];

if (process.env.PAPERTRAIL_LOGGING && process.env.PAPERTRAIL_LOGGING === 'true') {
  var winstonPapertrail = new winston.transports.Papertrail({
    host: process.env.PAPERTRAIL_HOST,
    port: process.env.PAPERTRAIL_PORT,
    hostname: process.env.APP_NAME || 'sg-app-backend',
    handleExceptions: true,
    colorize: true,
    level: process.env.PAPERTRAIL_LOGLEVEL || 'error',
    json: false,
    maxsize: 5242880,
    maxFiles: 5,
    logFormat: function(level, message) {
      return '[' + level + '] ' + message;
    },
  });

  logTransports.push(winstonPapertrail);

  winstonPapertrail.on('error', function(err) {
    console.log('>>> ERROR!! Failed to start papertrail logging. Error returned: %s', err);
  });
} else {
  // console.log('>>>> Skipping Papertrail log configuration!!');
}

if (process.env.CONSOLE_LOGGING && process.env.CONSOLE_LOGGING === 'true') {
  var winstonConsole = new winston.transports.Console({
    level: process.env.PAPERTRAIL_LOGLEVEL || 'error',
    json: false,
    colorize: true,
    prettyPrint: true,
    handleExceptions: true,
  });

  logTransports.push(winstonConsole);
} else {
  // console.log('>>>> Console logging not configured!!');
}

var logger = new winston.Logger({
  transports: logTransports,
  exitOnError: true,
});

function applogger() {}

function log(message) {
  logger.info(message);
}

function logError(err) {
  logger.error(err);
}

function logDebug(data) {
  logger.debug(data);
}

module.exports = applogger;
applogger.log = log;
applogger.info = log;
applogger.debug = logDebug;
applogger.error = logError;
