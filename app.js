/**
 * Module dependencies.
 */

var express = require('express'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorhandler = require('errorhandler'),
	// http = require('http'),  // 4.x 不再需要
    multer = require('multer'),
	path = require('path');
var morgan = require('morgan'); // http 请求日志工肯
var fs = require('fs');
var rfs = require('rotating-file-stream');

var
	routes = require('./routes/index'),
	user = require('./routes/user/user'),
	word = require('./routes/word/word'),
	note = require('./routes/note/note'),
	temp = require('./routes/word/word_temp.js');



var app = express();

// all environments
app.set('port', process.env.PORT || 6024);
app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(favicon("favicon.ico"));
//app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

// 设置日志输出到文件, 每天循环
var logDirectory = path.join(__dirname, 'logoutput');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory); // 目录不在就创建

// 创建一个循环写文件流，　每天循环
var accessLogStream = rfs('access.log', { interval: '1d', path: logDirectory });
app.use(morgan('combined', {stream: accessLogStream})); // 设置　logger

//app.use(app.router);  // 4.x 不再需要了




app.use(express.static(path.join(__dirname, 'public')));

//静态文件目录
app.use('/static', express.static(path.join(__dirname, 'static')));

// development only
if ('development' == app.get('env')) {
	app.use(errorhandler());
}





app.get('/', routes.index);

app.get('/word/:name', word.get);
app.post('/word/:name', word.post);

app.get('/note/:name', note.get);
app.post('/note/:name', note.post);

app.get('/user/:name', user.get);
app.post('/user/:name', user.post);

app.get('/temp/page', temp.page);
app.get('/temp/view', temp.view);
app.get('/temp/view_forget', temp.view_forget);
app.get('/temp/review_words', temp.review_words);
app.post('/temp/save', temp.save);
app.post('/temp/save_forget', temp.save_forget);
app.post('/temp/saveDayWords', temp.saveDayWords);
app.post('/temp/update_word', temp.update_word);

// init dirs
var init = require('./routes/base/init');
init.initApp();

try{
	app.listen(app.get('port'), function(){
	    console.log('Express server listening on port ' + app.get('port'));
	});
}catch(Err){
	console.log(Err);
}
