const decodeToken = (token) => {
    try {
        if (!token) return null;
        const parts = token.split('.');
        const payload = parts[1];
        const paddedPayload = payload + '='.repeat(((4 - payload.length % 4) % 4));
        // Base64 string lenght must be divisible by 4
        const decoded = JSON.parse(atob(paddedPayload));
        //atob decodes a base64 encoded string
        //JSON.parse converts the JSON String to a JavaScript object
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export default decodeToken;
