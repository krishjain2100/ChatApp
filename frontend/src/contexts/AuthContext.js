import React, { createContext, useContext, useState, useEffect } from 'react';
import decodeToken from '../utils/decodeToken';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};

const getAuth = () => {
    const Token = localStorage.getItem('accessToken');
    if (Token) {
        const decoded = decodeToken(Token);
        return { User: decoded, Token };
    }
    return { User: null, Uoken: null };
};


export const AuthProvider = ({ children }) => {
    const { User, Token } = getAuth();
    const [user, setUser] = useState(User);
    const [token, setToken] = useState(Token);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');;
        if (storedToken) {
            const decoded = decodeToken(storedToken);
            setUser(decoded);
            setToken(storedToken);
        }
    }, []);

    const login = (accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        const decoded = decodeToken(accessToken);
        setUser(decoded);
        setToken(accessToken);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        setToken(null);
        window.location.href = '/login';
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
