
var SC = require('../../config/serverConf');
var sqlite3 = require('sqlite3').verbose();
var Log = require('../common/log_utils');

var dict = require('./dict');

var dbFile = SC.wordnote.dbDir + SC.wordnote.dbFile;
var db = new sqlite3.Database(dbFile);
var StringUtil = require('../common/string_utils');

/** 保存单词 */
exports.saveWord = function(word,cb){
    db.serialize(function() {
	  db.run("INSERT INTO words (name, translate) VALUES (?,?)", word.text, JSON.stringify(word), cb);
	});
};

/** 查找单词 */
exports.getWord = function(text, cb){
    db.get("SELECT translate FROM words WHERE name=?", text, function(err, row){
        if(err){
            Log.e(e)
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
    Log.d(inStr);
    db.serialize(function() {
        var words = [];
        db.all("SELECT translate FROM words WHERE name in ("+inStr+")", function(err, rows) {
            if(err){
                Log.e(err)
                cb({});
                return;
            }
            for(var i=0; i<rows.length; i++){
	            words[words.length] = JSON.parse(rows[i].translate);
            }
            cb(words);
        });
    });
}

// dict.search("good", function(word){
//    exports.saveWord(word);
// })

// exports.getWord("hot", function(word){
//     Log.d(word.translate);
// });


