import { API_ENDPOINTS } from '../config/constants';
import formatChat from '../utils/formatChat';
const getChats = async (token, user) => {
    try {
        const response = await fetch(API_ENDPOINTS.MESSAGE.CONVERSATIONS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch conversations');
        }
        const data = await response.json();
        const formattedData = data.map(chat => formatChat(chat, user));
        return formattedData;
    } catch (error) {
        throw error;
    }
};

export default getChats;