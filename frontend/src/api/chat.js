import { API_ENDPOINTS } from "../config/constants";

const getChat = async (conversationId, token) => {
    try {
        const response = await fetch(`${API_ENDPOINTS.MESSAGE.MESSAGES}/${conversationId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        throw new Error('Failed to fetch messages');
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};

export default getChat;
