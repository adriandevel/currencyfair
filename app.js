var express = require('express');
var path = require('path');
var redis   = require('redis');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');
var conf = require('./libs/config/config.js');
var stats = require('./libs/stats.js');

var routes = require('./routes/index');

var app = express();
global.redis_client1 = redis.createClient(conf.env.redis_port, conf.env.redis_ip); //creates a new client
redis_client1.auth(conf.env.redis_password);

global.server = require('http').createServer(app).listen(conf.env.port, conf.env.ip);
global.io = require('socket.io').listen(server);
require('./libs/sockets')(io);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/users', users);

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

// calculate stats every 8 seconds
var stat = new stats(); 
setInterval(stat.calculateCountryTransactions, 8 * 1000);   

module.exports = app;
