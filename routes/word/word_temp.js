
/*
 * GET home page.
 */
var fs = require('fs');
var SC = require('../common/StringConstant');


var NL = SC.NL;

var storeFile = '/home/zhch/document/wordnote/notes_store.js';
var logFile = '/home/zhch/document/wordnote/notes.log';

var dayWordsDir = '/home/zhch/document/wordnote/daywords';


function writeLog(content, ip, callback){
    try{
        var logContent = '';
        logContent += ip + " -- new content: =========================" + new Date() + NL;
        logContent += content + NL;
        fs.appendFile(logFile, logContent, function (err) {
            if (err){
                console.error('Can\'t save logFile - content:' + logContent);
            }
            callback(0);
        });
    }catch (e){//Catch exception if any
        console.error('Exception:' + e + '\n' + 'Can\'t save logFile - content:' + logContent);
        callback(1);
    }
}


exports.save = function(req, res){

	var content = req.body.content;

	console.log("content:" + content);
    var ip = req.connection.remoteAddress;



    
    var callback = function(err){
        if(err > 0){
            res.send('{"status":0, "msg":"写日志出错了"}');
        }else{
            res.send('{"status":1}');
        }
    }
    
	fs.writeFile(storeFile, content, function (err) {
		if (err){
			console.error('Can\'t save storeFile - content:' + content);
			res.send('{"status":0, "msg":"不能打开文件"}');
		}
		
		writeLog(content, ip, callback);
	});
};


exports.view = function(req, res){

    fs.readFile(storeFile, function(err,data){
    	if(err){
    		res.send('{"status":0, "msg":"Get content error!!"}');
    	}
    	var ss = new String(data);
	    var result = {"status": 1,"content": ss};
		res.send(JSON.stringify(result));
    });
    
};

exports.page = function(req, res){
	res.render('word/temp.html', { title: 'Express' });
};


exports.saveDayWords = function(req, res){
    var content = req.body.content;
    var lines = content.split(NL);
    for(var i=0;i<lines.length;i++){
        console.log("---"+lines[i]+"===");
    }
}