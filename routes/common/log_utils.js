// 日志工具类
var moment = require('moment');


function addInfo(msg){
    return moment().format() + " " + msg;
}

function print(type, param1, param2){
    var pretext = addInfo(type);
    if(param2 != null){
        console.log(pretext, param1, param2);
    }else{
        console.log(pretext, param1);
    }
}


exports.d = function(param1, param2){
    print("DEBUG ", param1, param2);
}
exports.i = function(param1, param2){
    print("INFO ", param1, param2);
}
exports.e = function(param1, param2){
    print("ERROR ", param1, param2);
}


