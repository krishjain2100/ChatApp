import { API_ENDPOINTS } from '../config/constants.js';

const postLogin = async (username, password) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        return data;
    } 
    catch (error) {
        console.error('Login error:', error); 
        throw error; // Re-throw the error so the component can handle it
    }
};

export default postLogin;