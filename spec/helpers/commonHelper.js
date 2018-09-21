
var config = require('../../server/config.local');
var baseUrl = config.host+':'+config.port+config.restApiRoot+'/'; 
var timeInterval = 10000;

// exports is the "magic" variable that other files can read
exports.baseUrl = baseUrl;
baseUrl.timeInterval = timeInterval;