import { API_ENDPOINTS } from '../config/constants.js';

const postRegister = async (username, password) => {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        const data = await response.text();
        if (!response.ok) throw new Error(data);
        alert(data);
        window.location.href = `./login`;
    } 
    catch (error) {
        alert(error.message);
    }
};

export default postRegister;