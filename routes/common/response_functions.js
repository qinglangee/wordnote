
/*
 * GET home page.
 */
var fs = require('fs');
var St = require('../common/string_utils');
var serverConfig = require('../../config/serverConf');

var NL = St.NL;

var storeFile = serverConfig.tempdir.store;
var logFile = serverConfig.wordnote.logDir + serverConfig.wordnote.logFile;

var dayWordsDir = serverConfig.tempdir.words;

exports.success = function(){
    return {"err":0, "msg":"ok"};
}
/*
 * useage  res.send(failed("Date error");
*/
exports.failed = function(msg, errCode){
    var err = errCode == null ? 1 : errCode;
    return {"err":err, "msg":msg};
}

// 写日志
exports.writeLog = function(content, ip, callback){
    try{
        var logContent = '';
        logContent += ip + " -- new content: =========================" + new Date() + NL;
        logContent += content + NL;
        fs.appendFile(logFile, logContent, function (err) {
            if (err){
                console.error('Can\'t save logFile - content:' + logContent);
                console.error(err);
            }
            callback(0);
        });
    }catch (e){//Catch exception if any
        console.error('Exception:' + e + '\n' + 'Can\'t save logFile - content:' + logContent);
        callback(1);
    }
}

