var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs=require('fs-extra');
var routes = require('./routes');
var config=require('config');
var expressSession=require('express-session');
var SessionStore=require('connect-redis')(expressSession);
var flash=require('express-flash');

var app = express();

fs.mkdirsSync(config.pictureFile.headPictureFile);
fs.mkdirsSync(config.pictureFile.messagePictureFile);
fs.mkdirsSync(config.pictureFile.uploadPictureFile);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  resave:true,
  saveUninitialized:false,
  secret:config.session.secret,
  store:new SessionStore(config.redis),
  cookie: { maxAge: 3600000 }
}));

app.use(flash());
app.use(function resLocalsInit(req,res,next){
  var sess=req.session;
  if(sess.user){
    res.locals.user=sess.user;
  }else{
    res.locals.user=null;
  }
  res.locals.picturesHostAndPort=config.picturesHostAndPort;
  res.locals.head=config.pictureFile.head;
  res.locals.message=config.pictureFile.message;
  res.locals.upload=config.pictureFile.upload;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(config.filePath)));
app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
