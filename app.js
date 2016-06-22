var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

mongoose.connect("mongodb://127.0.0.1:27017/test");

var chatSchema = mongoose.Schema({
  username : String,
  message : String
});
var Chat = mongoose.model('Chat',chatSchema);
// var io = socket.io;

// console.log(socket);
// console.log(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
var users = [];

app.get('/instantiate',function(req,res){
  // console.log(req);
  var messages = [];
  Chat.find(function(err,data){
    if(err){
      console.log(err);
    } else {
      //console.log("data is "+data)
      messages = data;
      var response = {messages: messages, users: users};
      console.log("response is " + response);
      res.send(response);
    }
  })
  
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// var messages = [];


io.on('connection', function(socket){
  console.log('user connected');
  socket.on('new message', function(data){
    console.log(data);
    var chat = new Chat({username:data.username, message: data.message});
    chat.save(function(err,data){
      if(err) return console.log(err);
      else {
        console.log("data "+data);
        io.emit('new message',data);
      }
    });
    
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    var user = socket.username;
    var index = users.indexOf(user);
    users.splice(index,1);
    io.emit('user',users);
  });
  socket.on('new user',function(data,callback){
    // console.log(data);
    // console.log(callback);
    if(users.indexOf(data) == -1){

      users.push(data);
      console.log(users);
      callback(true);
      io.emit('user',users);
    }
    else{
      console.log("false was called");  
      callback(false)
    }
  });
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


module.exports = {app: app, server: server};
