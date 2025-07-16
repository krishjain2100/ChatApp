import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user, token } = useAuth();

    useEffect(() => {
        if (user && token) {
            const newSocket = io('http://localhost:3000');
            newSocket.on('connect', () => {
                newSocket.emit('user_online', user.id);
            });
            setSocket(newSocket);
            const heartbeat = setInterval(() => {
                if (newSocket.connected) newSocket.emit('user_online', user.id);
            }, 30000);
            return () => {
                clearInterval(heartbeat);
                newSocket.disconnect();
            };
        }
    }, [user, token]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
