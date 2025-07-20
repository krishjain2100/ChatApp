import { API_ENDPOINTS } from "../config/constants";
import formatMessage from "../utils/formatMessage";
import formatTime from "../utils/formatTime";

const getChat = async (conversationId, token, user) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.MESSAGE.MESSAGES}/${conversationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            const otherParticipant = data.participants.find(p => p._id !== user.id);
            const lastSeen = new Date(otherParticipant.lastSeen);
            const isOnline = (new Date() - lastSeen) < 2 * 60 * 1000;
            return {
                conversationInfo: {
                    name: otherParticipant.username,
                    avatar: otherParticipant.username.charAt(0).toUpperCase(),
                    isOnline: isOnline,
                    lastSeenText: isOnline ? 'Online' : `Last seen ${formatTime(lastSeen)}`
                },
                messages: data.messages.map(msg => formatMessage(msg, user.id))
            };
        }
        throw new Error('Failed to fetch messages');
    }
    catch (error) {
        throw error;
    }
};

export default getChat;
