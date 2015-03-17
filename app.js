/**
 * Module dependencies.
 */

var express = require('express'), 
	routes = require('./routes/index'), 
	http = require('http'), 
	path = require('path'), 
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
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//静态文件目录
app.use('/static', express.static(path.join(__dirname, 'static')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
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
app.post('/temp/save', temp.save);

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
