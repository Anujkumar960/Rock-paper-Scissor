const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameHistorySchema = new Schema({
  player: { type: String, required: true },
  playerChoice: { type: String, required: true },
  computerChoice: { type: String, required: true },
  result: { type: Number, required: true }
});

module.exports.GameHistory = mongoose.model('GameHistory', gameHistorySchema);
