const conversationModel = require("../models/conversationModel");

const GetAllConversations = async (req, res) => {
    try {
        const conversations = await conversationModel.find();
        res.status(200).json({ status: 'success', conversations, message: 'Conversations fetched successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch conversations', error: error.message });
    }
}

module.exports = {
    GetAllConversations
}