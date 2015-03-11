
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , user = require('./routes/user/user')
  , user = require('./routes/word/word')
  , user = require('./routes/note/note');

var app = express();

// all environments
app.set('port', process.env.PORT || 3100);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

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


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
