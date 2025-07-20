import formatTime from './formatTime';

const formatChat = (chat, user) => {
    const otherParticipant = chat.participants.find(p => p.username !== user.username);
    const { lastMessage, _id: id, unreadCount } = chat;
    return {
        _id: id,
        name: otherParticipant.username,
        lastMessage: lastMessage ? lastMessage.content : 'No messages yet',
        time: lastMessage ? formatTime(new Date(lastMessage.timestamp)) : '',
        lastMessageBy: lastMessage ? (lastMessage.sentBy._id === user.id ? 'You' : otherParticipant.username) : '',
        unreadCount: unreadCount || 0,
    };
};

export default formatChat;