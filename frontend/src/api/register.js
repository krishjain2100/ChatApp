import { API_ENDPOINTS } from '../config/constants.js';

const postRegister = async (username, email, password) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        });
        const data = await response.json(); 
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        return { success: true, message: data.message };
    } 
    catch (error) {
        throw error;
    }
};

export default postRegister;