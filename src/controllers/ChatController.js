const chatModel = require('../models/chatmodel');
const conversationModel = require('../models/conversationModel');
const createChat = async (req, res) => {
    try {

        const { recipientID, message, senderID } = req.body;
        const conversation = await conversationModel.find({
            participants: { $all: [recipientID, senderID] }
        });
        if (conversation.length === 0) {

            const conversation = await conversationModel.create({
                participants: [recipientID, senderID]
            })
            const conversationID = conversation._id;
            const chat = {
                recipientID,
                message,
                senderID,
                conversationID: conversationID
            }
            const newChat = new chatModel(chat);
            const savedChat = await newChat.save();
            global.io.to(global.userSockets.get(recipientID)).emit("newChat", savedChat);
            res.status(200).json({ status: "success", message: "Chat created successfully", chat: savedChat });
        }
        else {
            const conversationID = conversation[0]._id;
            const chat = {
                recipientID,
                message,
                senderID,
                conversationID: conversationID
            }
            console.log("Chat object:", chat)
            const newChat = new chatModel(chat);
            const savedChat = await newChat.save();
                        global.io.to(global.userSockets.get(recipientID)).emit("newChat", savedChat);

            res.status(200).json({ status: "success", message: "Chat created successfully", chat: savedChat });
        }


    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
}

const getChats = async (req, res) => {
    try {
        const { userId } = req.params;
        const chats = await chatModel.find()
        const filteredChats = chats.filter(chat => chat.recipientID === userId || chat.senderID === userId);
        res.status(200).json({ status: "success", message: "Chats retrieved successfully", chats: filteredChats });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
}

const deleteChat = async (req, res) => { }

const getChatsByConversationId = async (req, res) => {
    try {
       
        const { conversationId } = req.params;
        const chats = await chatModel.find({ conversationID: conversationId });
        res.status(200).json({ status: "success", message: "Chats retrieved successfully", chats });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
}

module.exports = {
    createChat,
    getChats,
    deleteChat,
    getChatsByConversationId
}