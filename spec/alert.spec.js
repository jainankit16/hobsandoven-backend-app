'use strict';
var loopback = require('loopback');
var app = require('../server/server');
var commonSpec = require('../spec/helpers/commonHelper');
var superagent = require('superagent');


describe('Alert', function () {
    // global variable
    var alertModel, originalTimeout;
    var baseUrl = commonSpec.baseUrl;
    //define fake variables
    var fakeStatusCode = 200;
    var fakeErrorMessage = 'Alert notification has been added successfully';
    var fakeCreateAlertData = {
        message: "A job has been added",
        type: "info",
        modelName: "job",
        modelId: "a1B1a000002bm7BEAQ",
        accountId: "0011a00000itklDAAQ",
        accessType: "staff",
        viewUrl: "/vms/jobs",
        userType: ["Case Dispatch Dept", "Case Dispatch Lead", "Customer Technical Contact"]
    };

    /**
     * beforeEach is used to define common things 
     * like connection with db , increase timeinterval
    */
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
        alertModel = loopback.getModel('Alert');
        var dataSource = loopback.createDataSource({
            connector: app.dataSources.db
        });
        alertModel.attachTo(dataSource);
    });

    it('should send notification to connected users', function (done) {
        superagent
            .post(baseUrl + 'Alerts/createAlert')
            .send(fakeCreateAlertData)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .end(function (err, data) {
                if (err) {
                   // console.log(data.body.error.message);        
                    expect(data.body.error.statusCode).toBe(fakeStatusCode);
                    expect(data.body.error.message).toBe(fakeErrorMessage);
                }                
               expect(data.body.statusCode).toEqual(fakeStatusCode);
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