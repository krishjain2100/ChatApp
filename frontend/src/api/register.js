const postRegister = async (username, password) => {
    try {
        const response = await fetch('http://localhost:3000/auth/register', {
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
    } 
    catch (error) {
        alert(error.message);
    }
};

export default postRegister;