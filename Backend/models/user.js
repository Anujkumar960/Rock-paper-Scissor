const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true, unique: true },
  score: { type: Number, default: 0 }
});

module.exports.User = mongoose.model('User', userSchema);
