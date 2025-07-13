import React, { createContext, useContext, useState, useEffect } from 'react';
import decodeToken from '../utils/decodeToken';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');;
        if (storedToken) {
            const decoded = decodeToken(storedToken);
            if (decoded) {
                setUser(decoded);
                setToken(storedToken);
            }
        }
        setLoading(false);
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

    const isAuthenticated = () => user !== null && token !== null;

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
