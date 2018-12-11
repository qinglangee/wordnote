
var multiparty = require('multiparty');
var fs = require("fs");
var path = require("path");


var serverConfig = require('../../config/serverConf');
var Log = require('../common/log_utils');
var respFunc = require('../common/response_functions');



var success = respFunc.success;
var failed = respFunc.failed;

// 上传文件保存的位置
var uploadPicDir = serverConfig.game.uploadPicDir;
var selfUploadPicDir = serverConfig.game.selfUploadPicDir;

// 保存图片
// multipart/form-data 类型, 参数 pass 是验证, upload是文件
function save(req, res){
	
    var form = new multiparty.Form({uploadDir:uploadPicDir});
    form.parse(req, function(err, fields, files) {
        var uploadType = fields["type"];
        
        if(err){
            res.send(failed("出错了 " + err));
            return;
        }
        // console.log("pass:" + fields["pass"]);

        if(files != null && files["upload"] != null){
            var filePath = files["upload"][0].path;
            Log.i("path:" + filePath);

            // 自主上传的换一个目录
            if(uploadType == "self"){
                var fileName = path.basename(filePath);
                var destPath = path.join(selfUploadPicDir, fileName);
                fs.rename(filePath, destPath);
            }
        }
        // console.log(files);
        res.send(success());
    });
}

// 总入口. 命令列表, 定义了这个js可以处理的方法
var coms={
    save: save
};

// post方法总入口 
function post(req, res){
    var name = req.params.name;
    
    if(coms[name]){
        coms[name](req, res);
    }else{
    	res.send("404 - page not find!");
    }
}

// get 与post用同一套方法 
exports.get = function(req, res){
    post(req, res);
};
exports.post = post;