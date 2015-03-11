
// 保存单词
function save(){
	
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