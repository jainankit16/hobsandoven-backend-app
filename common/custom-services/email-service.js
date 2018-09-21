'use strict';
var mailer = require('../lib/mailer');

module.exports = function (EmailService) {
    EmailService.sendEmail = function (req, cb) {
        mailer.send({
            from: 'noreply@serviceo.com',
            to: [req.toEmail],
            template: req.templatePath,
            params: {
                ctx: req,
            },
        }, function (err, result) {
            if (err) {
                cb(err, null);
            } else {
                let obj = {
                    accepted: result.accepted,
                    rejected: result.rejected,
                    success: true
                }
                cb(null, obj);
            }
        });
    };

    EmailService.remoteMethod('sendEmail', {
        accepts: {
            arg: 'req',
            type: 'object',
        },
        returns: {
            arg: 'data',
            type: 'Object',
            root: true,
        },
        description: 'Send Email',
    });
};
