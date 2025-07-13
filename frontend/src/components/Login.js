import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import postLogin from '../api/login';
import '../styles/Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username.trim() === '' || password === '') { 
            alert('Username and Password cannot be empty'); 
            return;
        }
        setIsLoading(true);
        try {
            const data = await postLogin(username, password);
            if (data && data.accessToken) {
                login(data.accessToken);
                window.location.href = `./main`; 
            } else {
                alert('Login failed - Invalid response from server');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert(error.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        window.location.href = './forgotPassword';
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to your account</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input 
                            className="form-input"
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
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
                            placeholder="Enter your password"
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isLoading}
                    > {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <div className="auth-links">
                    <button 
                        type="button" 
                        onClick={handleForgotPassword}
                        className="forgot-password-btn"
                    > Forgot Password?
                    </button>
                    <a href="/register" className="auth-link"> Don't have an account? Sign up </a>
                </div>
            </div>
        </div>
    );
}

export default Login;