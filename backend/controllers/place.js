var mongodb = require('mongodb');
const Place = require("../models/place");
var fs = require('fs');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

exports.create = function(request, response, next) {
    
    let place = new Place();
    place.name = request.body.name;
    place.description = request.body.description;
    place.address = request.body.address;
    place.userName = request.body.userName;
    place.userId = request.body.userId;
    place.file.data = fs.readFileSync(request.file.path);
    place.file.contentType = request.file.mimetype;

    place.save(function(error) {
        if(error) {
            console.log("Error: "+ error);
            return next(error);
        }

        sendJSONresponse(response, 200, {
            "message": "Successfuly added"
        });
    })
};

exports.getPlaceDetail = function(request, response, next) {
    Place.findById(request.params.id, function(error, place) {
        if(error) return next(error);

        var imgBase64 = (place.file.data.toString('base64'));
        var placesData = {
            name: place.name,
            _id: place._id,
            userName: place.userName,
            imgBase64: imgBase64,
            description: place.description,
            address: place.address
        };
        sendJSONresponse(response, 200, {
            "message": "Success",
            "data": placesData
        });
    })
};

exports.getAllPlaces = function(request, response, next) {
    Place.find({}, function(error, places) {
        var placesData = [];

        if(error) return next(error);
        
        places.forEach(function(place, index) {
            var imgBase64 = (place.file.data.toString('base64'));
            var temp = {
                name: place.name,
                _id: place._id,
                userName: place.userName,
                imgBase64: imgBase64
            };
            placesData.push(temp);
        });

        sendJSONresponse(response, 200, {
            "message": "Success",
            "data": placesData
        });
    });
};


exports.deletePlace = function(request, response, next) {
    Place.deleteOne({_id: new mongodb.ObjectID(request.body._id)}, function(error){
        if(error) return next(error);

        sendJSONresponse(response, 200, {
            "message": "Deleted"
        });
    })
}