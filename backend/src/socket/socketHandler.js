const Message = require('../models/messages.model');
const Conversation = require('../models/conversations.model');
const User = require('../models/users.model');

const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    socket.on('user_online', async (userId) => {
      socket.userId = userId;
      await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
    });
    socket.on('join_chat', (conversationId) => socket.join(conversationId));
    socket.on('send_message', async (messageData) => {
      try {
        const newMessage = new Message({
          conversationId: messageData.conversationId,
          senderId: messageData.senderId,
          content: messageData.content,
          timestamp: new Date()
        });
        const savedMessage = await newMessage.save();
        await Conversation.findByIdAndUpdate(
          messageData.conversationId, 
          {
            lastMessage: {
              content: messageData.content,
              sentBy: messageData.senderId,
              timestamp: new Date()
            }
          },
          { new: true }
        );

        io.to(messageData.conversationId).emit('new_message', savedMessage);
        io.to(messageData.conversationId).emit('conversation_updated', {
          userId: messageData.senderId,
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });
    socket.on('leave_chat', (conversationId) => socket.leave(conversationId));
    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(socket.userId, { lastSeen: new Date() });
    });
  });
};

module.exports = handleSocketConnection;
