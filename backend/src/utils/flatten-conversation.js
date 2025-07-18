const flattenConversation = (conversations) => {
    return conversations.map(conv => {
        const participants = conv.participants.map(participant => ({
            _id: participant.user._id,
            username: participant.user.username,
            lastOpened: participant.lastOpened || new Date()
        }));
        return {
            ...conv.toObject(),
            participants,
        };
    });
}

module.exports = flattenConversation;