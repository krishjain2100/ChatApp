import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import postLogin from '../api/login';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username.trim() === '' || password === '') { 
            toast.error('Username and Password cannot be empty'); 
            return;
        }
        setIsLoading(true);
        try {
            const data = await postLogin(username, password);
            if (data?.accessToken) {
                login(data.accessToken);
                navigate('/main'); 
            } else {
                toast.error('Login failed - Invalid response from server');
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error(error.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgotPassword');
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