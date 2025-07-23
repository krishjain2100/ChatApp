const Message = require('../models/messages.model');
const Conversation = require('../models/conversations.model');
const User = require('../models/users.model');
const authenticateSocket = require('../utils/socket-authenticate');

const handleSocketConnection = (io) => {

  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    socket.on('user_online', async () => {
      await User.findByIdAndUpdate(socket.userId, { lastSeen: new Date() });
      socket.join(socket.userId);
    });

    socket.on('join_chat', async (conversationId) => {
      socket.join(conversationId);
      await Conversation.updateOne(
        { _id: conversationId, 'participants.user': socket.userId },
        { $set: { 'participants.$.lastOpened': new Date() }} 
      ).catch(err => console.error('Error updating lastOpened:', err));
    });

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
        ); 
        let populatedMessage = await savedMessage.populate('senderId', 'username');
        const conv = await Conversation.findById(messageData.conversationId).select('participants');
        populatedMessage = populatedMessage.toObject();
        if (conv && conv.participants) {
          for (const participant of conv.participants) {
            io.to(participant.user.toString()).emit('new_message', populatedMessage);
          }
        }
        populatedMessage.tempId = messageData.tempId;
        io.to(messageData.conversationId).emit('new_message_private', populatedMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });


    socket.on('leave_chat', async (conversationId) => {
      await Conversation.updateOne(
        { _id: conversationId, 'participants.user': socket.userId },
        { $set: { 'participants.$.lastOpened': new Date() }} 
      ).catch(err => console.error('Error updating lastOpened:', err));
      socket.leave(conversationId);
    });


    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(socket.userId, { lastSeen: new Date() });
      socket.leave(socket.userId);
    });

    
  });
};

module.exports = handleSocketConnection;
