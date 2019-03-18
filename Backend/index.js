// backend code
const express = require('express');
//create express app
const app = express();
//to connect to mongodb
const mongoose = require('mongoose');
//to connect to geocode api and find lat and lang
var where = require('node-where');


// for getting data from post requests
const bodyParser = require('body-parser');
// to set the response to a html web page
app.set('view engine', 'ejs')

// for the get request-- what will user get on home screen
app.get('/', function (req, res) {
  //res.send('Hello World!');->to show this text in response
  res.render('menu1'); // this shows the menu1.ejs file placed in views folder as response
});
// if link directly accessed
app.get('/add',function(req,res){
	res.render('addAccessPoint1');
});
app.get('/show',function(req,res){
	res.render('findAccessPoint1');
});

// when user choosed any option on the home page.. i.e. post request
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/', function (req, res) {
  //res.render('index');
  
});
// when request made for add page from home page using button
app.post('/add', function (req, res) {
  console.log('Moved to add page');
  //res.redirect('/');->to again show same page
  //move to add page
  res.render('addAccessPoint1');
});
//when request made for show page from home page using button
app.post('/show', function (req, res) {
  console.log('Moved to show page');
  res.render('findAccessPoint1');
});

// Now to get address from the /add page and save it as geocode in our database i.e. handling post requests from this page
app.post('/accessList', function (req, res) { // code that will execute in background when address submitted
  

});
app.get('/accessList',function(req,res){  // home page showed to user as get request
	res.redirect('/');
});
app.post('/lockerList', function (req, res) {
  

});
app.get('/lockerList',function(req,res){
	res.redirect('/');
});


// to connect and save data to mongo db
//mongoose.connect('');

// port assigned to listen to the user's request
app.listen(process.env.port || 3000, function () {
  console.log('Example app listening on port 3000!');
});