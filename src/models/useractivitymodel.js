const mongoose = require('mongoose');
const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  socketId: { type: String, required: true },
  connectedAt: { type: Date, default: Date.now },
  disconnectedAt: { type: Date },
  lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserActivity', userActivitySchema);    