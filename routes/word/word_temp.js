
/*
 * GET home page.
 */
var fs = require('fs');
var St = require('../common/string_utils');
var dict = require('./dict');
var serverConfig = require('../../config/serverConf');
var respFunc = require('../common/response_functions')

var NL = St.NL;

var storeFile = serverConfig.tempdir.store;
var logFile = serverConfig.tempdir.log;

var dayWordsDir = serverConfig.tempdir.wordsDir;

var success = respFunc.success;
var failed = respFunc.failed;

// 写日志
var writeLog = respFunc.writeLog;

// 保存每日学习记录
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
            return;
		}

		writeLog(content, ip, callback);
	});
};

// 刷新学习记录
exports.view = function(req, res){

    fs.readFile(storeFile, function(err,data){
    	if(err){
            var msg = "Get content error!!" + err;
    		res.send('{"status":0, "msg":"'+msg+'"}');
            return;
    	}
    	var ss = new String(data);
	    var result = {"status": 1,"content": ss};
		res.send(JSON.stringify(result));
    });

};

// 显示页面
exports.page = function(req, res){
	res.render('word/temp.html', { title: 'Express' });
};

// 保存每日单词
exports.saveDayWords = function(req, res){
    var ip = req.connection.remoteAddress;

    var content = req.body.content;
    var lines = content.split(NL);
    var words = [];
    var time = '';
    for(var i=0;i<lines.length;i++){
        var line = St.trim(lines[i]);
        if(St.isEmpty(line)){continue;}
        words[words.length] = line;
        //console.log("---"+line+"===");
    }
    if(words.length < 2){
        res.send(failed("内容太少"));
        return;
    }

    time = words[0];
    if(!/^\d+$/.test(time)){
        res.send(failed("时间格式不对"));
        return;
    }
    var  contentFile = dayWordsDir + time;
    var exist = fs.existsSync(contentFile);
    if(exist && time != words[words.length - 1]){
        res.send(failed("这一天的单词已经提交过"));
        return;
    }

    var content = "";
    for(var i=0; i < words.length; i++){
        if(!/^\d+$/.test(words[i])){
            content += words[i] + NL;
        }
    }

    // 查单词后的回调函数
    var searchCallback = function(word){
        console.log(word);
        fs.writeFile(contentFile, JSON.stringify(word), function (err) {
            if (err){
                console.error('qwqwqwqwqwqwqw:' + content);
                console.error(err);
                res.send(failed("保存单词出错了。"));
                return;
            }
        });
    }

    var logCallback = function(err){
        if(err > 0){
            res.send(failed("写日志出错了"));
        }else{
            res.send(success());
        }
    }

	fs.writeFile(contentFile, content, function (err) {
		if (err){
			console.error('Can\'t save daywords - content:' + content);
			console.error(err);
			res.send(failed("保存单词出错了。"));
            return;
		}
        dict.search("hot", searchCallback);
		writeLog(content, ip, logCallback);
	});
}
