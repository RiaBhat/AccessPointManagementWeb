// backend code
const express = require('express');
//create express app
const app = express();
const Promise = require('bluebird');//bluebird is for promise

var distance = require('google-distance');// for distance between two geo codes
distance.apiKey = '54383ddcc3734cab8ce0e83f911be831';

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
// for saving to db
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
app.use(bodyParser.json()); // support json encoded bodies

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
  console.log("********************");
  var lat = res[0].latitude; // to get lattitude of address
   var lon = res[0].longitude; // to get longitude of address
  console.log('lat : '+ lat+' long: '+lon+' address '+str + ' no. ' +no+' x '+x);
  console.log("%%%%%%%%%%%%%%%%");  
  // object
  //now we will check in db if the access point already exists

   // geo.findOne({
   //    latt:lat,
   //    lann:lon
   //  }).then(user=>{
   //    if(user)
   //    {
   //      // access point already exists hence no change made in db
   //      console.log('This access point exists, we will not add it again');
   //    }
   //    else{
   //      //No such access point exists , hence access point saved
   //      item.save()
   //      .then(console.log('access point saved'));
   //    }
   //  });
    geo.find({address:str
    },function(err,final){
      if(err)
        console.log(err);
      console.log(final);
      if(final.length>0){
        // access point already exists hence no change made in db
        console.log('This access point exists, we will not add it again');
      }
      else{
        var item = new geo ({
        address:str,
        latt:lat,
        lonn:lon,
        lock:x
        });
        item.save(function(err,save){
          if(err)
            console.log(err);
            //No such access point exists , hence access point saved
          console.log(save);
          console.log('access point saved');
        })
      }
      

    });
  });
});
app.get('/accessList',function(req,res){  // home page showed to user as get request
  // that result show case or code to be shown to user
  //res.redirect('/');
  res.end();
});
app.post('/nice', function (req, res) {
  // this is what will be done when form of /addAP will be submitted
  let Aname = request.body.Aname;
  res.send(Aname);
});
app.post('/lockerList', function (req, res) {
  //forward geocoding needs to be done
  // need to find the geocode of address and add the no. of lockers to previous numbers in it
//   geocoder.geocode(req.body.Lname, function(err, res) {
//   console.log(res);
//    var lat = res[0].latitude; // to get lattitude of address
//    var lon = res[0].longitude; // to get longitude of address
//    var str = req.body.Lname;// address of existing access point
//   var no = req.body.Nname1;// number of lockers to be added
//   var x= parseInt(no,10);// int of number
//   console.log('lat : '+ lat+' long: '+lon+' address '+str + ' no. ' +no+' x '+x);

  console.log(req.body.Lname);
 
  geo.find({
    address : req.body.Lname
  },function(err,final){
    if(err)
      console.log(err);
      console.log(final);
      if(final.length>0){
        final[0].lock = final[0].lock+parseInt(req.body.Nname1,10);
        final[0].save();
        console.log("iteam updated");
      }
      else{
        console.log("access point not exist");
      }
  });
});
app.get('/lockerList',function(req,res){
	// that result show case or code to be shown to user
  //res.redirect('/');
  res.end();
});

// this is the function to find distance between two pairs of latitude and longitude
var rad = function(x) {
  return x * Math.PI / 180;
};
 var getDistance = function(p1lat, p1lng, p2lat, p2lng) {
   // returns the distance in kilometer
   var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2lat - p1lat);
  var dLong = rad(p2lng - p1lng);
  // console.log(dLat);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1lat)) * Math.cos(rad(p2lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  d = d/1000;
  return d;
};

var arr = []; // array to store relevent or needed data to show it to user in next web page in frontend
app.post('/search', function (req, response) { // code that will execute in background when address submitted
  // backward geocoding needs to be done
  //convert address provided by user to geocode 
  geocoder.geocode(req.body.fName, function(err, res) {
  console.log(res);
   var lat = res[0].latitude; // to get lattitude of address
   var lon = res[0].longitude; // to get longitude of address
   var str = req.body.fName; // to get the address of user (query address)
   var no = req.body.range;// to get the range 
   var x= parseInt(no,10);
   // console.log('lat= '+lat+' lon= '+lon+' address= '+str+' range '+x);
    
   // search nearest geocodes from database and return addresses as result
   //find every object in db and compare the distance``
  
   geo.find({}).then(function(result){// finding function for database
      var ct = 0;
      
      console.log(result.length); // no. of objects in database
      for(var i = 0; i<result.length ;i++)
      {
          var ans = getDistance(lat,lon,result[i].latt,result[i].lonn); // finding distance between the query address and the db addresses
          console.log(ans); // showing every distance in kilometers
          if(ans <= x)
          {
            // those addresses which are in the range as described by user
            ct++;
            arr.push(result[i]); // pushed all the results in the array for next webpage
          }
      }
      console.log("arr is filled: ", arr);
      console.log("redirecting to /search...");
      response.redirect("/search");
  });
         //res.send('/nearest',{response:arr});
         //res.send(arr);
});

});
app.get('/search',function(req,res){  // home page showed to user as get request
  // that result show case or code to be shown to user
  //res.send('arr');
  //res.redirect('/');
  console.log("arr in /search route", arr);
  res.render('nearestAccess', {arr:arr});
});

// for showing data searched to the user 
app.get('/nearest',function(req,res){
  res.render('nearestAccess');
});
app.post('/nearest',function(req,res){
  res.render('nearestAccess')
});



// to connect and save data to mongo db
//Username and password of the user is lockers1 
//form user schemas and save them to collections in database


// port assigned to listen to the user's request
app.listen(process.env.port || 3000, function () {
  console.log('Example app listening on port 3000!');
});