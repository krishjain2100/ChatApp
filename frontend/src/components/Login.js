import { useCallback, useMemo, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import postLogin from '../api/login';
import { toast } from 'react-toastify';
import '../styles/Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();  
    const navigate = useNavigate();
    const handleForgotPassword = useCallback(() => navigate('/forgotPassword'), [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username.trim() === '' || password.trim() === '') { toast.error('Username and Password cannot be empty'); return; }
        setIsLoading(true);
        try {
            const data = await postLogin(username, password);
            if (data?.accessToken) { login(data.accessToken); navigate('/main'); } 
            else { toast.error('Login failed - Invalid response from server'); }
        } catch (error) {
            toast.error(error.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fields = useMemo(() => [
        { key: 'username', label: 'Username', type: 'text', value: username, setValue: setUsername, placeholder: 'Enter your username' },
        { key: 'password', label: 'Password', type: 'password', value: password, setValue: setPassword, placeholder: 'Enter your password' },
    ], [username, password, setUsername, setPassword]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to your account</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {fields.map(field => (
                        <div className="form-group" key={field.key}>
                            <label className="form-label">{field.label}</label>
                            <input
                                className="form-input"
                                type={field.type}
                                value={field.value}
                                onChange={e => field.setValue(e.target.value)}
                                placeholder={field.placeholder}
                                disabled={isLoading}
                            />
                        </div>
                    ))}
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