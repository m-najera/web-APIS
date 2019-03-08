var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  name: String,
  email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
  },
  password: String
})

module.exports = mongoose.model('User', userSchema)