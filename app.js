// const appInsights = require("applicationinsights");
// appInsights.setup().start();
// appInsights.defaultClient.config.disableAppInsights = false;

var app = require('./server/server.js');

app.start();
