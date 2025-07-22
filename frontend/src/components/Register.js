import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import postRegister from '../api/register';
import { toast } from 'react-toastify';
import validator from 'validator';
import '../styles/Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (username.trim() === '' || email.trim() === '' || password.trim() === '') { toast.error('All fields are required'); return;}
        if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
        if (!validator.isEmail(email)) {toast.error('Please enter a valid email address'); return;}
        
        setIsLoading(true);
        try {
            const result = await postRegister(username, email, password);
            if (result.success) { toast.success(result.message); navigate('/login'); }
        } catch (error) { toast.error(error.message || 'Registration failed. Please try again.'); }
        finally { setIsLoading(false); }
    };

    const fields = useMemo(() => [
      { label: "Username", type: "text", value: username, setValue: setUsername, placeholder: "Choose a username" },
      { label: "Email", type: "text", value: email, setValue: setEmail, placeholder: "Enter your email address" },
      { label: "Password", type: "password", value: password, setValue: setPassword, placeholder: "Create a strong password" },
      { label: "Confirm Password", type: "password", value: confirmPassword, setValue: setConfirmPassword, placeholder: "Confirm your password" }
    ], [username, email, password, confirmPassword, setConfirmPassword, setEmail, setPassword, setUsername]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Join ChatApp</h1>
                <p className="auth-subtitle">Create your account to get started</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div className="form-group" key={field.label}>
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
                    > {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
                <div className="auth-links">
                    <a href="/login" className="auth-link"> Already have an account? Sign in.</a>
                </div>
            </div>
        </div>
    );
}

export default Register;