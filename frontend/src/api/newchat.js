import { toast } from "react-toastify";
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
        return { response, data };
        
    } catch (error) {
        toast.error('Error creating new chat:', error);
        return { response: null, data: null };
    }
};

export default createNewChat;

       