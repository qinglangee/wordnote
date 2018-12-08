
var http = require("http");
var request = require("request");
var fs = require("fs");

// exports.sendEmail = function (req, res) {
//}
// 发送url编码
function sendPost(param){
    var data = param.data;
 
    console.log(data);
    var opt = {
        method: "POST",
        host: "localhost",
        port: 6024,
        path: "/game/pic/save",
        headers: {
            "Content-Type": param.contentType,
            "Content-Length": data.length
        }
    };
 
    var req = http.request(opt, function (serverFeedback) {
        if (serverFeedback.statusCode == 200) {
            var body = "";
            console.log(" body start");
            serverFeedback.on('data', function (data) { body += data; })
                          .on('end', function () { 
                            //   res.send(200, body);
                            console.log(param.contentType + " body is: " + body); 
                            });
            console.log(" body behind");
        }
        else {
            console.log(param.contentType + " cuo cuo " + serverFeedback.statusCode);
        }
    });
    req.write(data + "\n");
    req.end();
}
// 发磅url编码类型参数
function sendUrlEncode(){
    var data = {
        address: 'test@test.com',
        subject: "test",
        pass: "ababab"
    };
    var param = {data:require('querystring').stringify(data)};
    param.contentType = "application/x-www-form-urlencoded";
    console.log(param);
    sendPost(param);
}
// post json类型参数
function sendJson(){
    var data = {
        address: 'test@test.com',
        subject: "test",
        pass: "hahaha"
    };

    var b0 = new Buffer("abcd", "utf-8");
 
    var param = {data:JSON.stringify(data)};
    param.contentType = "application/json";
    sendPost(param);
}

function requestGet(){
    var url = "http://localhost:6024/temp/view";
    request(url,function(error,response,body){
      if(!error && response.statusCode == 200){
          //输出返回的内容
          console.log(body);
      }else{
          console.log("error: " + error);
          if(response != null){
              console.log(" code: " + response.statusCode);
          }
      }
    });
}
//  json  参数
function requestPost1(){
    var options = { 
        uri: 'http://localhost:6024/game/pic/save', 
        method: 'POST', 
        json: { "pass": "3636336/" }
    };
     
    request(options, function(error, response, body) {
          if (!error && response.statusCode == 200) {
              //输出返回的内容
              console.log(body);
          }else{
            console.log("error: " + error);
            if(response != null){
                console.log(" code: " + response.statusCode);
            }
        }
    });

}
// form  参数
function requestPost2(){
    var url = 'http://localhost:6024/game/pic/save';
    request.post(url, {form:{pass:'naninani'}}, function(error, response, body){
        if (!error && response.statusCode == 200) {
              //输出返回的内容
              console.log(body);
        }
    });
}
// form 不好使??
function requestPost3(){
    var url = 'http://localhost:6024/game/pic/save';
    var r = request.post(url);
    var form = r.form();
    form.append('my_field', 'my_value');
    form.append('pass', 'lagou');
    form.append('upload', new Buffer([1, 2, 3]));
    // form.append('my_file', fs.createReadStream(path.join(__dirname, 'doodle.png')));
    // form.append('remote_file', request('http://google.com/doodle.png'));
}
function requestPost4(){
    var url = 'http://182.92.83.14:6024/game/pic/save';
    // 用stream传入文件参数
    var form = {
        pass:"ahama",
        upload: fs.createReadStream('/home/zhch/temp/d3/wood2.jpg'), 
    };
    request.post({url:url, formData:form}, function(error, response, body){
        if (!error && response.statusCode == 200) {
              //输出返回的内容
              console.log(body);
        }
    });
}
function requestPost5(){
    // var url = 'http://182.92.83.14:6024/game/pic/save';
    var url = 'http://localhost:6024/game/pic/save';
    fs.readFile('/home/zhch/temp/d3/wood.jpg', 'binary',function(err,data){
	    if(err) throw err;
	    // var jsonObj = JSON.parse(data);

        // 用Buffers传入文件参数
        var form = {
            pass:"ahama",
            upload: new Buffer(data), 
        };
        request.post({url:url, formData:form}, function(error, response, body){
            if (!error && response.statusCode == 200) {
                //输出返回的内容
                console.log(body);
            }
        });
	});

}

// sendUrlEncode();
// sendJson();

// requestGet();
requestPost5();

