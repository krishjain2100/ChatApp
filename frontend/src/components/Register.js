import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postRegister from '../api/register';
import '../styles/Auth.css';
import validator from 'validator';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username.trim() === '' || email.trim() === '' || password === '' || confirmPassword === '') { alert('All fields are required'); return;}
        if (password !== confirmPassword) { alert('Passwords do not match'); return; }
        if (!validator.isEmail(email)) {alert('Please enter a valid email address'); return;}
        
        setIsLoading(true);
        try {
            const result = await postRegister(username, email, password);
            if (result.success) {
                alert(result.message);
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert(error.message || 'Registration failed. Please try again.');
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
                        <label className="form-label">Email</label>
                        <input 
                            className="form-input"
                            type="text" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
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