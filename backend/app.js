// Importing frameworks
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');


require('../backend/models/db');
require('../backend/config/passport');

var routesApi = require('../backend/routes/index');

// Creating the Express Obj
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.disable('etag');
app.use(cors());


// Set up Passport
app.use(passport.initialize());
app.use('/api', routesApi);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var port = 1234;
app.listen(port, () => {
    console.log("Sever is Running");
});

module.exports = app;