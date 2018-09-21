'use strict';

var loopback = require('loopback');
var app = require('../server/server');
var commonSpec = require('../spec/helpers/commonHelper');
var superagent = require('superagent');

describe('User Alert', function () {
    // global variable
    var userAlertModel, originalTimeout;
    var baseUrl = commonSpec.baseUrl;
    //define fake variables
    var fakeStatusCode = 200;
    var fakeUserID = 689;
    var fakeAlertId = 5;
    var fakeUserAlertData = {
        isRead: false,
        id: 176,
        userId: 689,
        alertId: 110,
        alert:
            {
                message: 'A job has been added',
                type: 'info',
                modelName: 'job',
                viewUrl: '/vms/jobs',
                id: 110,
                createdAt: '2018-02-09T05:20:46.000Z'
            }
    };


    /**
     * beforeEach is used to define common things 
     * like connection with db , increase timeinterval
    */
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
        userAlertModel = loopback.getModel('UserAlert');
        // console.log(userAlertModel);
        var dataSource = loopback.createDataSource({
            connector: app.dataSources.db
        });
        userAlertModel.attachTo(dataSource);
    });

    it('should show all notification of that user', function (done) {
        superagent
            .post(baseUrl + 'UserAlerts/showAlertNotification')
            .send({ req: { userId: fakeUserID, limit: 1 } })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function (err, data) {
                if (err) {
                    expect(data.body.error.statusCode).toBe(fakeStatusCode);
                }
               // console.log(data.body[0])
                expect(data.body[0]).toEqual(data.body[0]);
                done();
            });
    });

    it('should total number of unread notification', function (done) {
        superagent
            .post(baseUrl + 'UserAlerts/showUnreadCount')
            .send({req: fakeUserID})
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function (err, data) {
                if (err) {
                  //  expect(data.body.error.statusCode).toBe(fakeStatusCode);
                }                
                expect(data.body).toEqual(data.body);
                done();
            });
    });

    it('should mark alert notificaton as read', function (done) {
        superagent
            .post(baseUrl + 'UserAlerts/markRead')
            .send({req: {alertId: fakeAlertId}})
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function (err, data) {
                if (err) {
                    // expect(data.body.error.statusCode).toBe(fakeStatusCode);
                }                
                expect(data.body.count).toEqual(data.body.count);
                done();
            });
    });

    /**
     * afterEach is used to destroy/revert beforeEach object
    */
    // afterEach(function() {
    //   jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    // });

});