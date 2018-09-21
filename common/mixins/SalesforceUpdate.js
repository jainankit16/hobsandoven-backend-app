'use strict';

var fs = require('fs');
var jsforce = require('jsforce');
var debug = require('debug')('loopback:synctools');
var logger = require('../lib/app-logger');

const util = require('util');

const EXCLUDE_PROPERTIES = [
  '__cachedRelations',
  '__data',
  '__dataSource',
  '__strict',
  '__persisted',
  'id',
  'sfdcId',
];

module.exports = function (Model, options) {
  Model.observe('after save', function event(ctx, next) {
    if (ctx.isNewInstance) {
      createRecord(Model, ctx, options);
    } else {
      if (ctx.data) {
        updateRecord(Model, ctx, options);
      }
    }
    next();
  });
  Model.observe('before delete', function (ctx, next) {
    if (ctx.Model.name === 'QuoteLineManager' || ctx.Model.name === 'DepartmentRole' || ctx.Model.name === 'MemberRole' || ctx.Model.name === 'Group') {
      deleteRecord(Model, ctx, options, next);
    }
  });
};

function dumpObject(data) {
  logger.debug(util.inspect(data, false, null));
}

function deleteRecord(Model, ctx, options, next) {
  if (process.env.SFDC_URL) {
    var conn = new jsforce.Connection({
      loginUrl: process.env.SFDC_URL,
    });
  } else {
    var conn = new jsforce.Connection();
  }

  conn.bulk.pollTimeout = 600000;
  conn.login(process.env.SFDC_USER, process.env.SFDC_PASS, function (err, res) {
    if (err) {
      logger.error(err);
    }
    // Lets's get the complete record based on the condition
    Model.find({
      where: ctx.where,
    }).then(record => {
      var arrSfdcId = [];
      record.map(item => {
        arrSfdcId.push(item.sfdcId);
      });
      logger.debug(arrSfdcId);
      conn.sobject(options.sfdcObject).delete(arrSfdcId, function (err, ret) {
        if (err) {
          return console.error(err, ret);
        }
        logger.info('Delete Successfully : ' + ret);
      });
      next();
    });
  });

}

function updateRecord(Model, ctx, options) {
  if (process.env.SFDC_URL) {
    var conn = new jsforce.Connection({
      loginUrl: process.env.SFDC_URL,
    });
  } else {
    var conn = new jsforce.Connection();
  }

  conn.bulk.pollTimeout = 600000;
  conn.login(process.env.SFDC_USER, process.env.SFDC_PASS, function (err, res) {
    if (err) {
      logger.error(err);
    }

    // Lets's get the complete record based on the condition
    Model.findOne({
      where: ctx.where,
    }).then(record => {
      if (!('sfdcId' in record)) {
        handleError('Property named "sfdcId" does not exist for this record', null);
        return;
      }

      prepareData(ctx.data, options, Model).then(
        function (res) {
          var data = res;
          data.Id = record.sfdcId;
          if (options.ignoreFields.length > 0) {
            Object.keys(data).forEach(key => {
              if (options.ignoreFields.indexOf(key) !== -1) {
                delete data[key];
              }
            });
          }

          conn.sobject(options.sfdcObject).update(data, function (err, ret) {
            if (err || !ret.success) {
              return console.error(err, ret);
            }
            logger.info('Updated Successfully : ' + ret.id);
          });
        },
        function (err) {
          logger.error(err);
        }
      );
    });
  });
}

function createRecord(Model, ctx, options) {
  if (process.env.SFDC_URL) {
    var conn = new jsforce.Connection({
      loginUrl: process.env.SFDC_URL,
    });
  } else {
    var conn = new jsforce.Connection();
  }

  conn.bulk.pollTimeout = 600000;
  conn.login(process.env.SFDC_USER, process.env.SFDC_PASS, function (err, res) {
    if (err) {
      logger.error(err);
    }

    var data = ctx.instance.__data;

    prepareData(data, options, Model).then(
      function (res) {
        data = res;

        if (options['ignoreFields'] && options['ignoreFields'].length > 0) {
          Object.keys(ctx.instance.__data).forEach(key => {
            if (options.ignoreFields.indexOf(key) !== -1 || EXCLUDE_PROPERTIES.indexOf(key) !== -1) {
              delete data[key];
            }
          });
        }
        conn.sobject(options.sfdcObject).create(data, function (err, ret) {
          if (err || !ret.success) {
            return console.error(err, ret);
          }
          Model.findById(ctx.instance.id, function (err, record) {
            if (err) {
              handleError(err);
            }
            record.updateAttribute('sfdcId', ret.id, function (err, result) {
              if (err) {
                handleError(err);
              }

              logger.info('Local record Created successfully');
            });
          });
        });
      },
      function (err) {
        logger.error(err);
      }
    );
  });
}

function prepareData(data, options, Model) {
  return new Promise(function (resolve, reject) {
    if (options.sfdcObject === 'CSQD_CaseComment__c') {
      if (data.modelId && data.modelName) {
        Model.app.models[data.modelName].findById(data.modelId, {
            fields: ['sfdcId'],
          },
          function (err, model) {
            if (err) {
              logger.error(err);
              return reject(err);
            } else {
              logger.debug(model);
              if (data.modelName === 'Job') {
                data['Job__c'] = model.sfdcId;
              }
              if (data.modelName === 'Case') {
                data['Case__c'] = model.sfdcId;
              }
              if (data.modelName === 'Order') {
                data['Order__c'] = model.sfdcId;
              }
              if (data.modelName === 'RequestFormReceipt') {
                data['Request_Form_Receipt__c'] = model.sfdcId;
              }
              resolve(data);
            }
          });
      } else {
        reject('Model name or Model ID missing.');
      }
    } else {
      resolve(data);
    }
  });
}

function handleError(err, traceData) {
  logger.error(err);
  logger.debug(traceData);
}
