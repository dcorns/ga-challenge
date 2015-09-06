/**
 * server.js
 * All backend code is here
 * It handles server side rendering of page, request routing, and favorite movie list persistence
 */
var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function(req, res){
  res.send('/');
});

app.get('/search/*', function(req, res){
  var searchTerm = req.path.substr(req.path.lastIndexOf('/') + 1);
  console.log(searchTerm);
  var apiRes = searchAPI(searchTerm);
  console.log(apiRes);
  res.send(apiRes);
});

app.get('/favorites', function(req, res) {
  var data = fs.readFileSync(__dirname + '/data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});
app.post('/favorites', function(req, res){
  console.log(req.body);
  var data = fs.readFileSync(__dirname + '/data.json');
  data = JSON.parse(data);
  data.push(req.body);
  data = JSON.stringify(data);
  fs.writeFile(__dirname + '/data.json', data, function(err){
    res.setHeader('Content-Type', 'application/json');
    if(err){
      console.error(err);
      res.send(err);
    }
    else res.send(data);
  });
});
app.listen(3000, function(){
  console.log("Listening on port 3000");
});

function searchAPI(searchTerm){
  var options = {
    host: 'www.omdbapi.com',
    port: 80,
    path: '/?s=' + searchTerm,
    method: 'GET'
  };
  return http.request(options, function(res){
    res.setEncoding('utf8');
    res.on('data', function(chunk){
      //console.log('BODY: ' + chunk);
    });
  });
}