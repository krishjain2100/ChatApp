import { useState } from 'react';
import '../styles/Auth.css';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Forgot Password</h2>
                <form className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input 
                            id="username"
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;