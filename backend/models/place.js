const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let placeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  file: {
    data: Buffer,
    contentType: String
  },
  userName: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Place', placeSchema);