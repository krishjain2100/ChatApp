const mongoose = require('mongoose');
const ConversationSchema = mongoose.Schema(
    {
        participants: [{
            _id: false,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                index: true,
                required: true
            },
            lastOpened: {
                type: Date,
                default: Date.now
            }
        }],
        lastMessage: {
            content: {
                type: String
            },
            sentBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            timestamp: {
                type: Date,
                default: Date.now,
                index: true
            }
        },
    },
    { 
        timestamps: true 
    }
);
ConversationSchema.index({ 'participants.user': 1, 'lastMessage.timestamp': -1 });
const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;