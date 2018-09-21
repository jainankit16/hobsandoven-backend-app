'use strict';

const https = require('https');

module.exports = function(GoogleService) {
  GoogleService.getDistance = function(req, cb) {
    var api_key = 'AIzaSyAvM86Xx6bRTnyGMnxEn_wCH0LfvJ3ijrY';
    var url =
      'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' +
      req.source +
      '&destinations=' +
      req.destination +
      '&key=' +
      api_key;

    https.get(url, res => {
      var response = '';
      res.on('data', data => {
        response += data;
      });

      res.on('end', () => {
        response = JSON.parse(response);
        switch (response.status) {
          case 'OK':
            cb(null, response);
            break;
          case 'INVALID_REQUEST':
            var error = {
              statusCode: '400',
              code: 'Invalid Request Error',
              message: 'Invalid Request Error',
            };
            cb(error, null);
            break;
          default:
            var error = {
              statusCode: '500',
              code: 'Internal Server Error',
              message: 'Internal Server Error',
            };
            cb(error, null);
            break;
        }
      });

      res.on('error', () => {
        cb(error, null);
      });
    });
  };
};
