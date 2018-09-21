

'use strict';

var newdateFormat;

function dateFormat() { }

function triggerNewformat(date, formate = "short") {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var _month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    var _date = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    if (formate === 'short') {
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        newdateFormat = _month + '/' + _date + '/' + date.getFullYear() + '  ' + strTime;
    } else if (formate === 'shortDate') {
        newdateFormat = _month + '/' + _date + '/' + date.getFullYear();
    } else if (formate === 'mmyyyy') {
        newdateFormat = date.toLocaleString("en-us", { month: "short" }) + ' ' + date.getFullYear();
    } else {
        newdateFormat = date;
    }
    return newdateFormat;
}

module.exports = dateFormat;
dateFormat.triggerNewformat = triggerNewformat;