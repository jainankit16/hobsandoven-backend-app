'use strict';
var async = require('async');
var loopback = require('loopback');
var LoopBackContext = require('loopback-context');

function pushNotification() {}

function createAlert(Alert, req, cb) {
  if (
    req.alert.message == undefined ||
    req.alert.type == undefined ||
    req.userAlert.accessType == undefined ||
    req.userAlert.userType == undefined
  ) {
    cb(
      {statusCode: 400, message: 'Please enter message , accessType, error type and userType'},
      null
    );
  } else {
    Alert.create(req.alert, function(err, alert) {
      if (err) {
        cb(err);
      } else {
        var alertId = alert.id;
        req['userAlert']['AlertId'] = [];
        req['userAlert']['AlertId'].push(alertId);
        req['userAlert']['Alert'] = alert;
        addUserAlert(Alert, req.userAlert, cb);
      }
    });
  }
}

function addUserAlert(Alert, req, cb) {
  var alertId = req.AlertId;
  var accountId = req.accountId;
  var accessType = req.accessType;
  var _userType = req.userType;
  var userAlert = [];
  var TypeId = [];

  Alert.app.models.UserType.find(
    {
      where: {name: {inq: _userType}},
      fields: {id: true},
    },
    function(error, userTypeId) {
      if (userTypeId.length > 0) {
        for (var k in userTypeId) {
          var e = userTypeId[k].id;
          TypeId.push(e);
        }

        if (accessType == 'internal') {
          var condition = {accessType: 'internal', isActive: true, userTypeId: {inq: TypeId}};
        } else {
          var condition = {
            AccountId: accountId,
            accessType: accessType,
            isActive: true,
            userTypeId: {inq: TypeId},
          };
        }
        Alert.app.models.Users.find(
          {
            where: condition,
            fields: {id: true, sfdcId: true, AccountId: true},
          },
          function(error, userList) {
            if (userList.length > 0) {
              for (var k in userList) {
                userAlert.push({
                  alertId: alertId,
                  userId: userList[k].id,
                });
              }
              Alert.app.models.UserAlert.create(userAlert, function(err, userAlertData) {
                if (err) {
                  cb(err);
                } else {
                  let _userAlertData = {};
                  let _ualertData = [];
                  for (var ele in userAlertData) {
                    _userAlertData = {
                      isRead: userAlertData[ele].isRead,
                      id: userAlertData[ele].id,
                      alertId: userAlertData[ele].alertId,
                      userId: userAlertData[ele].userId,
                      createdAt: userAlertData[ele].createdAt,
                      updatedAt: userAlertData[ele].updatedAt,
                      alert: req.Alert,
                    };
                    _ualertData.push(_userAlertData);
                    // var recipientUsers = {};
                    // if (Alert.app.io._currentUserId === _userAlertData.userId) {
                    //     recipientUsers[_userAlertData.userId] = Alert.app.io;
                    //     recipientUsers[_userAlertData.userId].emit('countAlert', 1);
                    //     recipientUsers[_userAlertData.userId].emit('onCreatedAlert', _userAlertData);
                    // }
                  }

                  cb(null, {
                    message: 'Alert notification has been added successfully',
                    statusCode: 200,
                    data: _ualertData,
                  });
                }
              });
            } else {
              cb({statusCode: 400, message: 'No one user belongs to this User Type '}, null);
            }
          }
        );
      } else {
        cb({statusCode: 400, message: 'Please enter valid user type '}, null);
      }
    }
  );
}

module.exports = pushNotification;
pushNotification.createAlert = createAlert;
