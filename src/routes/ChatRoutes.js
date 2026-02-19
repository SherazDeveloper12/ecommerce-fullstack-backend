const express = require('express');
const chatRouter = express.Router();

const { 
    createChat, 
    getChats, 
    deleteChat,
    getChatsByConversationId
} = require('../controllers/ChatController');

// Route to create a new chat
chatRouter.post('/create', createChat);
// // Route to get all chats for a user
chatRouter.get('/:userId', getChats);
// // Route to delete a chat
chatRouter.delete('/delete/:chatId', deleteChat);
// route to get chat by conversation ID
chatRouter.get('/conversation/:conversationId', getChatsByConversationId);

module.exports = chatRouter;