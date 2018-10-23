const express = require('express');
const bp = require('body-parser');
const cp = require('cookie-parser');
const fs = require('fs');
const app = express();
const mongoose=require('mongoose');
const winston=require('winston');

//Adding timestamp to winston logging library
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp':true});

mongoose.connect('mongodb://localhost/placement');

//using cookie parser and body parser
app.use(cp());
app.use(bp.json());
app.use(bp.urlencoded({extended: true}));

//CORS (cross origin resource sharing)
// app.use(function(err,req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type'); next(); })
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//mounting files on the server
app.use('/static', express.static(__dirname + "/public_static"));

//using the routes made in api.js
app.use('/', require('./routes/api'));

//using error handling middleware
app.use(function(err,req,res,next){
    winston.log('error',err)
    res.send('error');
})


//starting the server on port 7777
app.listen(7777, function () {
     winston.log('info', 'Server started on http://localhost:7777')
});