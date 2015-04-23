
var fs = require('fs');
var SC = require('../../config/serverConf');
var sqlite3 = require('sqlite3').verbose();


var storeFile = SC.tempdir.store;
var logFile = SC.tempdir.log;

var dayWordsDir = SC.tempdir.words;

// path 存在并且是目录则返回 true, 否则返回 false
function isExistDir(path){
    if(!fs.existsSync(path)){
        return false;
    }
    var stats = fs.statSync(path);
    if(!stats.isDirectory()){
        return false;
    }
    return true;
}

// 如果目录不存在， 就创建之
function confirmDir(path){
    if(!isExistDir(path)){
        fs.mkdirSync(path);
    }
}

function dirErr(name, path){
    return new Error(name + " dir does not exist or is not a directory. path: " + path);
}

// 初始化目录
function initDir(){
    if(!isExistDir(SC.base)){
        throw dirErr("Base", SC.base);
    }
    var wordnote = SC.wordnote;
    confirmDir(wordnote.logDir);
    confirmDir(wordnote.dbDir);
    var tempdir = SC.tempdir;
    confirmDir(tempdir.wordsDir);
}


// 初始化目录
exports.initApp = function(){
    initDir();
};

///////// 下面是单独执行的 //////////////////////////////////////////////////

var table_words = "CREATE TABLE words (name TEXT UNIQUE, translate TEXT)";
// 初始化数据库
function initDatabase(){
    var dbFile = SC.wordnote.dbDir + SC.wordnote.dbFile;
    var db = new sqlite3.Database(dbFile);
    db.serialize(function() {
        db.run(table_words);
	});

	db.close();
}

// initDatabase();
