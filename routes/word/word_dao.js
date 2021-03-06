
var SC = require('../../config/serverConf');
var sqlite3 = require('sqlite3').verbose();
var Log = require('../common/log_utils');

var dict = require('./dict');

var dbFile = SC.wordnote.dbDir + SC.wordnote.dbFile;
var db = new sqlite3.Database(dbFile);
var StringUtil = require('../common/string_utils');
var Promise = require('promise');

/** 保存单词 */
exports.saveWord = function(word,cb){
    db.serialize(function() {
	  db.run("INSERT INTO words (name, translate) VALUES (?,?)", word.text, JSON.stringify(word), cb);
	});
};
/** 更新单词 */
exports.updateWord = function(word,cb){
    db.serialize(function() {
	  db.run("UPDATE words SET translate=? WHERE name=?", JSON.stringify(word), word.text, cb);
	});
};

/** 查找单词 */
exports.getWord = function(text, cb){
    db.get("SELECT translate FROM words WHERE name=?", text, function(err, row){
        if(err){
            Log.e(err)
            cb(null);
            return;
        }
        if(row == null){
            cb(null)
            return;
        }
        var word = JSON.parse(row.translate);
        cb(word);
    });
}

/** 批量查找单词 */
exports.getWords = function(wordsText, cb){
    var inStr = StringUtil.joinSql(wordsText);
//     Log.d(inStr);
    return new Promise(function(fulfill, reject){

        db.serialize(function() {
            var words = [];
            db.all("SELECT translate FROM words WHERE name in ("+inStr+")", function(err, rows) {
                if(err){
                    reject(err);
                }else{
                    for(var i=0; i<rows.length; i++){
                        try{
                            words[words.length] = JSON.parse(rows[i].translate);
                        }catch(err001){
                            Log.e("数据库单词解析格式出错 text:", rows[i].translate, err001)
                        }
                    }
                    fulfill(words);
                }
            });
        });
    });
}


// dict.search("good", function(word){
//    exports.saveWord(word);
// })

// exports.getWord("hot", function(word){
//     Log.d(word.translate);
// });


