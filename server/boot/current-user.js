'use strict';

var logger = require('../../common/lib/app-logger');

module.exports = function (app) {

  app.remotes().phases.addBefore('invoke', 'options-from-request').use(function (ctx, next) {
    var token = ctx.args.options && ctx.args.options.accessToken;

    if (!token) return next();

    app.models.Users.findById(ctx.args.options.accessToken.userId, function (err, user) {
      if (err) return next(err);

      ctx.args.options.currentUser = user;
      next();
    });
  });

};
