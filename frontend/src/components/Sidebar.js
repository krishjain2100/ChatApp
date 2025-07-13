import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import getChats from '../api/sidebar';
import { useAuth } from '../contexts/AuthContext';
import SidebarItems from './SidebarItems';
import '../styles/Chats.css';;

const Sidebar = () => {
    const [chats, setChats] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedChatId = searchParams.get('conversation'); //tuple
    const { user, token } = useAuth();

    const handleChatClick = (chatId) => {
        setSearchParams({ conversation: chatId });
    };
    useEffect(() => {
        const fetchChats = async () => {
            if (!user || !token) return;
            
            try {
                const data = await getChats(token); 
                if (data) { 
                    setChats(data.map(chat => ({
                        id: chat._id,
                        name: chat.participants
                            .filter(p => p.username !== user.username)
                            .map(p => p.username)
                            .join(', '),
                        lastMessage: chat.lastMessage ? chat.lastMessage.content : '',
                        time: chat.lastMessage ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                    })));
                }
            } catch (error) {
                console.error('Error in fetchChats:', error);
            }
        };
        fetchChats();
    }, [user, token]);

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