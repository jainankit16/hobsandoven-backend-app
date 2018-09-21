'use strict';

var async = require('async');
var debug = require('debug')('serviceo-backend:mailer');
var Email = require('email-templates');
var nodemailer = require('nodemailer');
var path = require('path');
var logger = require('./app-logger');

var t = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE || false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function Mailer() { }

/**
 * Send Email
 * @param {Object} data Contruct of data to use for sending mail
 * @param {string} [data.from='noreply@service.me'] Array of email receipients
 * @param {Array} data.to Array of email receipients
 * @param {string} data.template Name of email template to use
 * @param {Object} data.params Data parameters to comsume by template
 * @callback
 */
function sendMail(data, cb) {
  logger.debug(data);

  const email = new Email({
    message: {
      from: data.from || 'noreply@serviceo.me',
    },
    views: {
      root: '/src/email_templates',
    },
    send: true,
    preview: false,
    transport: t,
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: '/src/build',
      }
    },
  });

  email
    .send({
      template: data.template,
      message: {
        to: data.to,
      },
      locals: data.params,
    })
    .then(result => {
      logger.debug(result);
      cb(null, result);
    })
    .catch(err => {
      logger.error(err);
      cb(err, null);
    });
}

module.exports = Mailer;
Mailer.send = sendMail;
