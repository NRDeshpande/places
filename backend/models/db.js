var mongoose = require('mongoose');

// Reading the config file for DB user name and password
var fs = require('fs')
var ini = require('ini');
var config = ini.parse(fs.readFileSync('/etc/places/config.ini', 'utf-8'));

var dbURI = 'mongodb://'+config.database.user+':'+config.database.password+'@ds235778.mlab.com:35778/'+config.database.database;

mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

// Loging the USER schema
require('./users');