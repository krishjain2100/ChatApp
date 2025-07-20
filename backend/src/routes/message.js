const express = require('express');
const authenticateToken = require('../utils/authenticate');
const flattenConversation = require('../utils/flatten-conversation');
const router = express.Router();
const User = require('../models/users.model');
const Conversation = require('../models/conversations.model');
const Message = require('../models/messages.model');

router.use(authenticateToken);

router.get('/conversations', async (req, res) => {
    const { id } = req.user;
    try {
        const conversations = await Conversation.find({ 'participants.user': id })
        .populate('participants.user', 'username')
        .populate('lastMessage.sentBy', 'username')
        .sort({ 'lastMessage.timestamp': -1 });
        const conversationsWithUnread = await Promise.all(flattenConversation(conversations).map(async (conv) => {
            const userParticipant = conv.participants.find(p => p._id == id);
            let unreadCount = 0;
            const check = conv?.lastMessage?.sentBy && !(conv.lastMessage.sentBy._id == id);
            if (check) {
                if (userParticipant.lastOpened) {
                    unreadCount = await Message.countDocuments({
                        conversationId: conv._id, 
                        timestamp: { $gt: userParticipant.lastOpened }, 
                        senderId: { $ne: id } 
                    });
                } else {
                    unreadCount = await Message.countDocuments({
                        conversationId: conv._id,
                        senderId: { $ne: id }
                    });
                }
            }
            return {
                ...conv,
                unreadCount: unreadCount
            };
            
        }));
        res.status(200).json(conversationsWithUnread);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/messages/:conversationId', async (req, res) => {
    const { conversationId } = req.params;
    const { id: userId } = req.user;
    try {
        const conversation = await Conversation.findById(conversationId).populate('participants.user', 'username lastSeen');
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
        if (!conversation.participants.some(participant => participant.user._id == userId)) {return res.status(403).json({ message: 'Access denied' });}

        const messages = await Message.find({ conversationId }).populate('senderId', 'username').sort({ timestamp: 1 });
        const participants = conversation.participants.map(participant => ({
            _id: participant.user._id,
            username: participant.user.username,
            lastSeen: participant.user.lastSeen
        }));
        res.status(200).json({
            participants,
            messages
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
        'participants.user': { $all: [userId, participantUser._id] }
    });
    if (existingConversation) {
        return res.status(409).json({ 
            message: 'Conversation already exists',
            conversationId: existingConversation._id
        });
    }
    const conversation = new Conversation({
        participants: [{ user: userId, lastOpened: new Date() }, { user: participantUser._id, lastOpened: null }],
        lastMessage: null
    });
    await conversation.save();
    const populatedConversation = await Conversation.findById(conversation._id).populate('participants.user', 'username lastSeen');
    const flattenedConversation = flattenConversation([populatedConversation])[0];
    res.status(201).json(flattenedConversation);
});


module.exports = router;

