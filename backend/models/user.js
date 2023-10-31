// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  watchHistory: [
    {
      movieid: String, // Add the movie name here
      timestamp: Date,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
