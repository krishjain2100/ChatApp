import { API_ENDPOINTS } from "../config/constants";

const createNewChat = async (participant, token) => {
    try {
        const response = await fetch(API_ENDPOINTS.MESSAGE.NEW_CHAT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ participant })
        });
        const data = await response.json();
        return { status: response.status, data };

    } catch (error) {
        throw error
    }
};

export default createNewChat;

       