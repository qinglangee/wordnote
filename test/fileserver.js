var multiparty = require('multiparty');
var http = require('http');
var util = require('util');

// 上传文件并接收的一个服务器示例
http.createServer(function(req, res) {
  if (req.url === '/upload' && req.method === 'POST') {
    // parse a file upload
    var form = new multiparty.Form({uploadDir:"/home/zhch/temp/d3"});
 
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      console.log(fields);
      console.log(files);

      res.end(util.inspect({fields: fields, files: files}));
    });
 
    return;
  }
 
  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
}).listen(8080);