var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

 //CORS Support
 app.use(function (req,res,next){
 	res.header('Access-Control-Allow-Origin','*');
 	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
 	res.header('Access-Control-Allow-Headers','Content-Type');
 	next();
 });

//app.use('/api', routes);
require('./routes/angularroutes.js')(app);
require('./routes/noderoutes.js')(app);

app.listen(3000,function(req,res){
  console.log("server running at port 3000");
})
