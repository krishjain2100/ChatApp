const mongoose = require('mongoose');
const ConversationSchema = mongoose.Schema(
    {
        participants: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            required: true
        },
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
                default: Date.now
            }
        },
    },
    { 
        timestamps: true 
    }
);
const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation;