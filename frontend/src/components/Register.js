import { useState } from 'react';
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

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (username.trim() === '' || password === '') { alert('Username and Password cannot be empty'); return;}
        postRegister(username, password);
    };

    return (
        <div>
            <p style = {{textAlign: 'center', fontSize: '30px'}} >Register</p>
            <div style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: 'auto' }}>
                <div style={{display: 'flex', flexDirection: 'row', textAlign: 'center', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', gap: '10px'}}>
                    <div style={{ flex: 0.5 }}> Username: </div>
                    <input style = {{flex: 1.5}} type="text" onChange={(e)=>setUsername(e.target.value)}/> 
                </div>
                <div style={{display: 'flex', flexDirection: 'row', textAlign: 'center', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', gap: '10px'}}>
                    <div style={{ flex: 0.5 }}> Password:  </div>
                    <input style = {{flex: 1.5}} type="password" onChange={(e)=>setPassword(e.target.value)} /> 
                </div>
                <button type="submit" onClick={handleSubmit}> Register </button>
            </div>
        </div>
    );
}

export default Register;