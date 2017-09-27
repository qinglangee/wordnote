// 日志工具类
var moment = require('moment');


function addInfo(msg){
    return moment().format() + " " + msg;
}

function print(type, args){
    var pretext = addInfo(type);
    var logArgs = [];
    logArgs[0] = pretext;
    if(args != null && args.length > 0){
        for(var i=0; i<args.length;i++){
            logArgs[i+1] = args[i];
        }
    }
    console.log.apply(this, logArgs);
    
    
}


exports.d = function(){
    print("DEBUG ", arguments);
}
exports.i = function(){
    print("INFO ", arguments);
}
exports.e = function(){
    print("ERROR ", arguments);
}


