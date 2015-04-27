var base = "/home/zhch/document/wordnote/";
// var base = "d:\\temp\\node_js_wordnote\\";
var wordnote ={
    logDir:base + "logs",
    logFile:"/notes.log",
    dbDir:base + "database/",
    dbFile: "wordnote.db"
};

var tempdir = {
    store:base + "notes_store.js",
    forget:base + "notes_forget.js",
    wordsDir:base + "daywords/",

}
exports.wordnote=wordnote;
exports.tempdir=tempdir;
exports.base=base;
