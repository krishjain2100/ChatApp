import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useAuth from '../hooks/useAuth';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user, token } = useAuth();
    useEffect(() => {
        if (user && token) {
            const newSocket = io(process.env.REACT_APP_API_BASE_URL, { auth: { token: token }});
            newSocket.on('connect', () => newSocket.emit('user_online', user.id));
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
