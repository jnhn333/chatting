// // server.js
//
// var express = require('express');
// var app = express();
// var http = require('http').Server(app); //1
// var io = require('socket.io')(http);    //1
//
// app.get('/',function(req, res){  //2
//   res.sendFile(__dirname + '/client.html');
// });
//
// var count=1;
// io.on('connection', function(socket){ //3
//   console.log('user connected: ', socket.id);  //3-1
//   var name = "user" + count++;                 //3-1
//   io.to(socket.id).emit('change name',name);   //3-1
//
//   socket.on('disconnect', function(){ //3-2
//     console.log('user disconnected: ', socket.id);
//   });
//
//   socket.on('send message', function(name,text){ //3-3
//     var msg = name + ' : ' + text;
//     console.log(msg);
//     io.emit('receive message', msg);
//   });
// });
// var port = process.env.PORT || 3000; //*
// app.listen(port, function(){
//   console.log('Server On!');
// });
// // http.listen(3000, function(){ //4
// //   console.log('server on!');
// // });

var app = require('express')();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io')(server);

// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다
io.on('connection', function(socket) {

  // 접속한 클라이언트의 정보가 수신되면
  socket.on('login', function(data) {
    console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

    // socket에 클라이언트 정보를 저장한다
    socket.name = data.name;
    socket.userid = data.userid;

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    io.emit('login', data.name );
  });

  // 클라이언트로부터의 메시지가 수신되면
  socket.on('chat', function(data) {
    console.log('Message from %s: %s', socket.name, data.msg);

    var msg = {
      from: {
        name: socket.name,
        userid: socket.userid
      },
      msg: data.msg
    };

    // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
    socket.broadcast.emit('chat', msg);

    // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
    // socket.emit('s2c chat', msg);

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    // io.emit('s2c chat', msg);

    // 특정 클라이언트에게만 메시지를 전송한다
    // io.to(id).emit('s2c chat', data);
  });

  // force client disconnect from server
  socket.on('forceDisconnect', function() {
    socket.disconnect();
  });

  socket.on('disconnect', function() {
    console.log('user disconnected: ' + socket.name);
  });
});

var port = process.env.PORT || 3000; //*
app.listen(port, function(){
  console.log('Server On!');
});
