'use strict';
var loopback = require('loopback');
var LoopBackContext = require('loopback-context');


function getCustomError() {}
/**
 * 
 * @param {Number} statusCode 
 * @param {String} code 
 * @param {Sting} errorMessage 
 */
function buildError(statusCode, code, errorMessage) {
    const err = new Error(errorMessage);
    err.statusCode = statusCode;
    err.code = code;
    return err;
}

module.exports = getCustomError;
getCustomError.buildError = buildError;
