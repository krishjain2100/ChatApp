import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-content">
                {user && (
                    <div className="user-info">
                        <div className="user-avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="username">{user.username}</span>
                    </div>
                )}
                <button onClick={logout} className="logout-btn">
                    Logout
                </button>
            </div>
        </header>
    );
}

export default Header;