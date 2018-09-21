var uuid = require('uuid-v4');
module.exports = function (app) {
    // tmp folder to be used for downloading files like csv, pdf etc
    app.dataSources.storage.connector.createContainer({ name: 'tmp' }, function (err, c) {
        return;
    });

    //Function for generating unique file name..
    app.dataSources.storage.connector.getFilename = function (origFilename, req, res) {
        var origFilename = origFilename.name;
        var parts = origFilename.split('.');
        var extension = parts[parts.length - 1];

        return uuid() + '.' + extension;
    }
}