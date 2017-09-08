// 日志工具类
var moment = require('moment');


function addInfo(msg){
    return moment().format() + " " + msg;
}

function print(text, param2){
    if(param2 != null){
        console.log(text, param2);
    }else{
        console.log(text);
    }
}


exports.d = function(msg, param2){
    var text = addInfo(msg);
    print("DEBUG " + text, param2);
}
exports.i = function(msg, param2){
    var text = addInfo(msg);
    print("INFO " + text, param2);
}
exports.e = function(msg, param2){
    var text = addInfo(msg);
    print("ERROR " + text, param2);
}


