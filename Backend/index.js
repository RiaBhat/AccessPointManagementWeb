// backend code
const express = require('express');
//create express app
const app = express();

// for reading input
var readline = require('readline-sync');

// for finding distances
var distance = require('google-distance');

//to connect to mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://lockers1:lockers1@ds125486.mlab.com:25486/accesspoints',{useNewUrlParser:true});
var db= mongoose.connection;
db.on('error',function(err){
  if(err)
  console.log(err+' connection err');

});
db.once('open',function(){
  console.log('database connected');
});

//to connect to geocode api and find lat and lang
var NodeGeocoder = require('node-geocoder');
// for geocoding
var options = {
  provider: 'opencage',//google

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: '54383ddcc3734cab8ce0e83f911be831', // for Mapquest, OpenCage, Google Premier
  formatter: null        // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);
/*
var geocoder = NodeGeocoder({
  provider: 'opencage',
  apiKey: '54383ddcc3734cab8ce0e83f911be831'
});

* Reverse Geocoding
geocoder.geocode('37.4396, -122.1864', function(err, res) {
  console.log(res);
});
0r
geocoder.reverse({lat:45.767, lon:4.833}, function(err, res) {
  console.log(res);
});
*Forward Geocoding
geocoder.geocode('29 champs elysée paris', function(err, res) {
  console.log(res);
  or
  geocoder.geocode({address: '29 champs elysée', country: 'France', zipcode: '75008'}, function(err, res) {
  console.log(res);
});

});

*for distance between two addresses
distance.get(
  {
    origin: 'San Francisco, CA',
    destination: 'San Diego, CA'
  },
  function(err, data) {
    if (err) return console.log(err);
    console.log(data);
});
*/

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
  // forward geocoding needs to be done
  //let Aname = request.body.Aname;
  var str = req.body.Aname;
  var no = req.body.Nname;
  var x= parseInt(no,10);
  geocoder.geocode(req.body.Aname, function(err, res) { //req.body.Aname  '29 champs elysée paris'
  console.log(res);
  var lat = res[0].latitude; // to get lattitude of address
   var lon = res[0].longitude; // to get longitude of address
  console.log('lat : '+ lat+' long: '+lon+' address '+str + ' no. ' +no+' x '+x);  

  // now we will save add, lat and lon to databse
  //schema
  var codeSchema = new mongoose.Schema({
    address:String,
    latt : Number,
    lonn : Number,
    lock : Number
  });
  // model
  var geo = mongoose.model('geo', codeSchema);
  // object
  var item = geo ({
    address:str,
    latt:lat,
    lonn:lon,
    lock:x
  }).save(function(err){
  if(err)
  throw err;
  console.log('item saved');
  });

  });
});
app.post('/nice', function (req, res) {
  // this is what will be done when form of /addAP will be submitted
  let Aname = request.body.Aname;
  res.send(Aname);
});
app.get('/accessList',function(req,res){  // home page showed to user as get request
	// that result show case or code to be shown to user
  //res.redirect('/');
});
app.post('/lockerList', function (req, res) {
  //forward geocoding needs to be done
  // need to find the geocode of address and add the no. of lockers to previous numbers in it
  geocoder.geocode(req.body.Lname, function(err, res) {
  console.log(res);
  const lat = res[0].latitude; // to get lattitude of address
   var lon = res[0].longitude; // to get longitude of address
});
});
app.get('/lockerList',function(req,res){
	// that result show case or code to be shown to user
  //res.redirect('/');
});
app.post('/search', function (req, res) { // code that will execute in background when address submitted
  // backward geocoding needs to be done
  //convert address to geocode 
  geocoder.geocode(req.body.fName, function(err, res) {
  console.log(res);
  const lat = res[0].latitude; // to get lattitude of address
   var lon = res[0].longitude; // to get longitude of address

   // search nearest geocodes and return addresses as result


   // reverse
   geocoder.reverse(lat,lon , function(err, res) { //fName
    console.log(res);
  });

  });
  
  //geocoder.geocode('37.4396, -122.1864', function(err, res) {
  //console.log(res);
  //});
});
app.get('/search',function(req,res){  // home page showed to user as get request
  // that result show case or code to be shown to user
  //res.redirect('/');
});

// to connect and save data to mongo db
//Username and password of the user is lockers1 
//form user schemas and save them to collections in database


// port assigned to listen to the user's request
app.listen(process.env.port || 3000, function () {
  console.log('Example app listening on port 3000!');
});