const express = require('express');
const conversationRouter = express.Router();
const { 
    // CreateConversation,
    // GetUserConversations,
    // GetConversationById,
    // DeleteConversation,
    GetAllConversations
} = require('../controllers/conversationController');

// Route to create a new conversation
// conversationRouter.post('/create', CreateConversation);
// // Route to get conversations for a user    
// conversationRouter.get('/:userId', GetUserConversations);
// // Route to get a conversation by ID
// conversationRouter.get('/conversation/:conversationId', GetConversationById);
// // Route to delete a conversation
// conversationRouter.delete('/delete/:conversationId', DeleteConversation);
// Route to get all conversations (for admin)
conversationRouter.get('/all', GetAllConversations);
module.exports = conversationRouter;