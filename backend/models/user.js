// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  watchHistory: [
    {
      movieid: {
        type: String,
        unique: true // `id` must be unique
      },
      movieTitle: String,
      timestamp: Date,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
