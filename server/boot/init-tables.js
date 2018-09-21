var path = require('path');
var fs = require('fs');

module.exports = function (app) {
  var db = app.dataSources.db;
  var docDb = app.dataSources.docDb;

  var dbModels = [
    'AccessToken',
    'ACL',
    'RoleMapping',
    'Role',

    'Country',
    'Timezone',
    'Users'
  ];

  var docDbModels = [
    'Comment',
    'Activity',
  ];

  // if (!process.env.INITTABLES) {
  //   return;
  // }

  console.log('Initializing the database tables...');

  db.autoupdate(dbModels, function (err) {
    if (err) throw err;
  });

  docDb.autoupdate(docDbModels, function (err) {
    if (err) throw err;
  });

};
