const postLogin = async (username, password) => {
    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
        else throw new Error('No access token received');
        window.location.href = `./main`; 
    } 
    catch (error) {
        console.error('Login error:', error); 
        alert(error.message);
    }
};

export default postLogin;