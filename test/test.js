
var init = require('../routes/base/init');
var dao = require('../routes/word/word_dao');

var SC = require('../config/serverConf');
var sqlite3 = require('sqlite3').verbose();
var Log = require('../routes/common/log_utils');

var dict = require('../routes/word/dict');

var dbFile = SC.wordnote.dbDir + SC.wordnote.dbFile;
var db = new sqlite3.Database(dbFile);



// init.initDatabase();

// db.each("SELECT translate FROM words",function(err, row){
//     Log.i(row.translate);
// });

db.serialize(function() {
    var words = [];
    inStr = "'liver','hin','hide'";
    db.each("SELECT translate FROM words WHERE name in ("+inStr+")", function(err, row) {
        if(err){
            Log.e(err)
            return;
        }
        if(row == null){
            return;
        }
        words[words.length] = JSON.parse(row.translate);
    Log.d(words);
    });
    Log.d(words);
});
