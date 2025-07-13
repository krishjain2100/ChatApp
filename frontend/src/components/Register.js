import { useState } from 'react';
import postRegister from '../api/register';
import '../styles/Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username.trim() === '' || password === '' || confirmPassword === '') {  alert('All fields are required');  return;}
        if (password !== confirmPassword) { alert('Passwords do not match'); return; }
        if (password.length < 6) { alert('Password must be at least 6 characters long'); return;}
        setIsLoading(true);
        try {
            await postRegister(username, password);
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Join ChatApp</h1>
                <p className="auth-subtitle">Create your account to get started</p>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input 
                            className="form-input"
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                            className="form-input"
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong password"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input 
                            className="form-input"
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                
                <div className="auth-links">
                    <a href="/login" className="auth-link">
                        Already have an account? Sign in
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Register;