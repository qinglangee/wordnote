
/*
 * GET home page.
 */
var fs = require('fs');
var St = require('../common/string_utils');
var dict = require('./dict');
var serverConfig = require('../../config/serverConf');
var respFunc = require('../common/response_functions');
var dao = require('./word_dao');
var Log = require('../common/log_utils');
var url = require("url");

var NL = St.NL;

var storeFile = serverConfig.tempdir.store;
var logFile = serverConfig.tempdir.log;

var dayWordsDir = serverConfig.tempdir.wordsDir;

var success = respFunc.success;
var failed = respFunc.failed;

// 写日志
var writeLog = respFunc.writeLog;

function searchAndSaveTranslate(text){
    // 数据库里查一下， 没有的就插入
    dao.getWord(text, function(dbWord){
        if(dbWord == null){
            dict.search(text, function(word){
                dao.saveWord(word, function(err){
                    if(err)
                        Log.e(err);
                    else
                        Log.i("插入一条单词： " + text);
                });
            });
        }
    });
}

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


    var logCallback = function(err){
        if(err > 0){
            res.send(failed("写日志出错了"));
        }else{
            res.send(success());
        }
    }

    var onlyWords = [];
    // 把words中的日期去掉，保存到onlyWords中
    for(var i=0; i < words.length; i++){
        if(!/^\d+$/.test(words[i])){
            onlyWords[onlyWords.length] = words[i];
        }
    }

	fs.writeFile(contentFile, content, function (err) {
		if (err){
			console.error('Can\'t save daywords - content:' + content);
			console.error(err);
			res.send(failed("保存单词出错了。"));
            return;
		}
		writeLog(content, ip, logCallback);

        for(var i=0; i<onlyWords.length; i++){
            var text = onlyWords[i];
            searchAndSaveTranslate(text);
        }
	});
}

// 返回所有要背的单词
exports.review_words = function(req, res){
    var daysStr = url.parse(req.url,true).query.days;
    var days = daysStr.split("|");
    var allWords = [];
    for(var i=0; i<days.length; i++){
        var  wordsFile = dayWordsDir + days[i];
        var fileContent = fs.readFileSync(wordsFile, {"encoding":"utf-8"});
        var words = fileContent.split('\n');

//         for(var j=0;i<words.length; j++){
//             allWords[allWords.length] = words[j].split('|')[1];
//         }
        allWords = allWords.concat(words);
    }


    dao.getWords(allWords, function(dbWords){
        var result = success();
        result.content = dbWords;
        res.send(result);
    });
}
