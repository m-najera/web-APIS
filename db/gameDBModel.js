var mongoose = require('mongoose')

var gameSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required : true
  },
  name: {
    type: String,
    unique: true,
    uppercase: true
  },
  year: Number,
  genre: String
})

module.exports = mongoose.model('Game', gameSchema)