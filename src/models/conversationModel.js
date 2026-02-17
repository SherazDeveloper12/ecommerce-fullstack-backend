const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: { type: Array, ref: 'Auth' },
    lastMessage: { type: String },
    lastMessageTime: { type: Date, default: Date.now }
},
    { timestamps: true });
conversationSchema.set('collection', 'conversations');
const conversationModel = mongoose.model('Conversation', conversationSchema);
module.exports = conversationModel;