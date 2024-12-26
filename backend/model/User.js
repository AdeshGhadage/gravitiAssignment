const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: {
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    default: { latitude: 0, longitude: 0 } // Default location (0,0)
  },
  admin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
