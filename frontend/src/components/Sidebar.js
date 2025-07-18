import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { toast } from 'react-toastify';
import getChats from '../api/sidebar';
import formatTime from '../utils/formatTime';
import SidebarItems from './SidebarItems';
import NewChatModal from './NewChatModal';
import createNewChat from '../api/newchat';
import useDebounce from '../hooks/useDebounce';
import '../styles/Chats.css';

const Sidebar = () => {
    const [chats, setChats] = useState([]);
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedChatId = searchParams.get('conversation'); //tuple
    const { user, token } = useAuth();
    const { socket } = useSocket();
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedQuery = useDebounce(searchQuery, 300);

    const filtered = useMemo(() => {
        const q = debouncedQuery.toLowerCase();
        return chats.filter(item =>
        item.name.toLowerCase().startsWith(q)
    )}, [chats, debouncedQuery]);

    const handleChatClick = (chatId) => setSearchParams({ conversation: chatId });
    const handleNewChatClick = () => setOpen(true);
    const handleClose = () => {setOpen(false); setUsername('');};

    const handleCreateChat = async () => {
        try {
            const { response, data } = await createNewChat(username, token);
            if (!response || !data) {toast.error('Failed to create chat. Please try again.'); return;}
            if (response.status === 201) {
                setSearchParams({ conversation: data._id });
                fetchChats();
                handleClose();
            } else if (response.status === 409) {
                toast.info(data.message || 'Chat already exists with this user');
                setSearchParams({ conversation: data.conversationId });
                handleClose();
            } else {
                toast.error(data.message || 'Failed to create chat. Please try again.');
            }
        } catch (error) {toast.error('Failed to create chat. Please try again.');}
    };

    const fetchChats = async () => {
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
                        _id: chat._id,
                        name: otherParticipant.username,
                        lastMessage: chat.lastMessage ? chat.lastMessage.content : 'No messages yet',
                        time: chat.lastMessage ? formatTime(new Date(chat.lastMessage.timestamp)) : '',
                        lastMessageBy: chat.lastMessage ? (chat.lastMessage.sentBy === user.id ? 'You' : otherParticipant.username) : '',
                        unreadCount: chat.unreadCount || 0,
                    };
                });
                setChats(formattedChats);
            }
        } catch (error) {
            console.error('Error in fetchChats:', error);
        }
    };

    useEffect(() => {
        if (!user || !socket) return;
        fetchChats();
        socket.on('new_message', () => fetchChats());
        socket.on('joined_chat', () => fetchChats());
        return () => {
            socket.off('new_message', () => fetchChats());
            socket.off('joined_chat', () => fetchChats());
        };
    }, [user, socket, fetchChats]);
    
    return (
        <>
        <div className="chats-wrapper">
            <div className="new-chat-section">
                <button className="new-chat-btn" onClick={handleNewChatClick}>
                    <span className="new-chat-icon">+</span>
                    New Chat
                </button>
            </div>
            <div className="search-section">
                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
            <div className="chats-list">
                {filtered.map(chat => (
                   <SidebarItems 
                        key={chat._id} 
                        chat={chat}
                        selectedChatId={selectedChatId}
                        handleChatClick={handleChatClick}
                    />
                ))}
            </div>
        </div> 
        <NewChatModal
            open={open}
            handleClose={handleClose}
            username={username}
            setUsername={setUsername}
            handleCreateChat={handleCreateChat}
        />
        </>
    );
}

export default Sidebar;