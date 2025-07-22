const mongoose = require('mongoose');
const MessageSchema = mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true
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
MessageSchema.index({ conversationId: 1, timestamp: -1 });
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;