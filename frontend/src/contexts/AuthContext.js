import { createContext, useState, useEffect } from 'react';
import decodeToken from '../utils/decodeToken';

export const AuthContext = createContext();

const getAuth = () => {
    const Token = localStorage.getItem('accessToken');
    if (Token) {
        const decoded = decodeToken(Token);
        return { User: decoded, Token };
    }
    return { User: null, Token: null };
};


export const AuthProvider = ({ children }) => {
    const { User, Token } = getAuth();
    const [user, setUser] = useState(User);
    const [token, setToken] = useState(Token);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');;
        if (storedToken && !user) {
            const decoded = decodeToken(storedToken);
            setUser(decoded);
            setToken(storedToken);
        }
    }, [user]);

    const login = (accessToken) => {
        const decoded = decodeToken(accessToken);
        setUser(decoded);
        setToken(accessToken);
        localStorage.setItem('accessToken', accessToken);
    };

    const logout = () => {
        window.location.href = '/login';
        localStorage.removeItem('accessToken');
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
