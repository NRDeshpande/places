var express = require('express');
var router = express.Router();
var multer = require("multer");
var jwt = require('express-jwt');
var fs = require('fs')
var ini = require('ini');

// Reading the config file for jwt_secret
var config = ini.parse(fs.readFileSync('/etc/places/config.ini', 'utf-8'));

var auth = jwt({
  secret: config.default.jwt_secret,
  userProperty: 'payload'
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './upload')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)
  }
})
const upload = multer({
  storage: storage
})

// Contollers
var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var ctrlPlace = require('../controllers/place');

// profile API
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication API's
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// places API's (CURD)
router.post('/saveNewPlace', upload.single('file'), ctrlPlace.create);
router.get('/places', ctrlPlace.getAllPlaces);
router.get('/placeDetail/:id', ctrlPlace.getPlaceDetail);
router.post('/deletePlace', ctrlPlace.deletePlace);

module.exports = router;