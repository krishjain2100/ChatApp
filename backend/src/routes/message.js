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

router.post('/new', async (req, res) => {
    const { participant } = req.body;
    const { id: userId, username} = req.user;
    if (!participant) return res.status(400).json({ message: 'Participant is required' });
    if (participant === username)  return res.status(400).json({ message: 'You cannot include yourself as a participant' });
    const participantUser = await User.findOne({ username: participant });
    if (!participantUser) return res.status(400).json({ message: 'User not found' });
    const existingConversation = await Conversation.findOne({
        participants: { $all: [userId, participantUser._id] }
    });
    if (existingConversation) {
        return res.status(409).json({ 
            message: 'Conversation already exists',
            conversationId: existingConversation._id
        });
    }
    const conversation = new Conversation({
        participants: [userId, participantUser._id],
        lastMessage: null
    });
    await conversation.save();
    const populatedConversation = await Conversation.findById(conversation._id).populate('participants', 'username lastSeen');
    res.status(201).json(populatedConversation);
});


module.exports = router;

