const mongoose = require('mongoose');
const MessageSchema = mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            minlength: 1
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    { 
        timestamps: true 
    }
);
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;