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
//
// var port = process.env.PORT || 3000; //*
// app.listen(port, function(){
// //http.listen(3000, function(){ //4
//   console.log('server on!');
// });

var http = require('http');
var fs = require('fs');

http.createServer(function(req, res){
    fs.readFile('client.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
    });
}).listen(8000);
