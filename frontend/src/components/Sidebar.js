import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import getChats from '../api/sidebar';
import formatTime from '../utils/formatTime';
import SidebarItems from './SidebarItems';
import '../styles/Chats.css';

const Sidebar = () => {
    const [chats, setChats] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedChatId = searchParams.get('conversation'); //tuple
    const { user, token } = useAuth();
    const { socket } = useSocket();

    const handleChatClick = (chatId) => setSearchParams({ conversation: chatId});
    const fetchChats = useCallback (async () => {
        if (!token) {
            setChats([]);
            return;
        }
        try { 
            const data = await getChats(token); 
            if (data) { 
                const formattedChats = data.map(chat => {
                    const otherParticipant = chat.participants.find(p => p.username !== user.username); 
                    return {
                        id: chat._id,
                        name: otherParticipant.username,
                        lastMessage: chat.lastMessage ? chat.lastMessage.content : 'No messages yet',
                        time: chat.lastMessage ? formatTime(new Date(chat.lastMessage.timestamp)) : '',
                    };
                });
                setChats(formattedChats);
            }
        } catch (error) {
            console.error('Error in fetchChats:', error);
        }
    }, [token, user]);

    useEffect(() => {
        if (!user || !socket) return;
        fetchChats();
        socket.on('new_message', () => fetchChats());
        return () => socket.off('new_message', () => fetchChats());
    }, [user, socket, fetchChats]);
    
    return (
        <div className="chats-wrapper">
            <div className="chats-list">
                {chats.map(chat => (
                   <SidebarItems 
                        key={chat.id} 
                        chat={chat}
                        selectedChatId={selectedChatId}
                        handleChatClick={handleChatClick}
                    />
                ))}
            </div>
        </div>
    );
}

export default Sidebar;