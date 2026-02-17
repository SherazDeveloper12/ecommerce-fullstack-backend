const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    conversationID: { type: String, required: true },
    recipientID: {type: String, default: '69843421d30a0ace506d9172', ref: 'Auth'},
    message: {type: String, required: true},
    senderID: { type: String, ref: 'Auth' },
    isRead: { type: Boolean, default: false }
},
    { timestamps: true });
chatSchema.set('collection', 'chats');
const chatModel = mongoose.model('Chat', chatSchema);
module.exports = chatModel;