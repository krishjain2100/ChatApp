import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <h1 className="header-title"> All Chats </h1>
            <div className="header-user">
                {user && (
                    <>
                        <span className="header-user-name">Welcome, {user.username}</span>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;