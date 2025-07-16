const express = require('express');
const authenticateToken = require('../utils/authenticate');
const router = express.Router();
const User = require('../models/users.model');
const Conversation = require('../models/conversations.model');
const Message = require('../models/messages.model');

router.use(authenticateToken);

router.get('/conversations', async (req, res) => {
    const { id } = req.user;
    try {
        const conversations = await Conversation.find({ participants: id })
            .populate('participants', 'username lastSeen')
            .sort({ updatedAt: -1 });
        res.status(200).json(conversations);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/messages/:conversationId', async (req, res) => {
    const { conversationId } = req.params;
    const { id: userId } = req.user;

    try {
        const conversation = await Conversation.findById(conversationId).populate('participants', 'username lastSeen');
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

        if (!conversation.participants.some(participant => participant._id.toString() === userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const messages = await Message.find({ conversationId }).populate('senderId', 'username').sort({ timestamp: 1 });
        
        res.status(200).json({
            conversation: conversation,
            messages: messages
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;

