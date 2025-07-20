import { API_ENDPOINTS } from '../config/constants';

const getChats = async (token) => {
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
        return data;
    } catch (error) {
        throw error;
    }
};

export default getChats;