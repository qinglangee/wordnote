var base = "/home/zhch/document/wordnote/";
//var base = "d:\\temp\\node_js_wordnote\\";
var wordnote ={
    logDir:base + "logs"
};

var tempdir = {
    log: base + "notes.log",
    store:base + "notes_store.js",
    words:base + "daywords",

}
exports.wordnote=wordnote;
exports.tempdir=tempdir;
