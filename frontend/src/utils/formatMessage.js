const formatMessage = (message, id) => ({
    id: message._id,
    text: message.content,
    sender: message.senderId.username || 'Unknown',
    time: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isMe: message.senderId._id === id
});

export default formatMessage;
