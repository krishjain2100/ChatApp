import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import getChats from '../api/sidebar';
import formatTime from '../utils/formatTime';
import SidebarItems from './SidebarItems';
import NewChatModal from './NewChatModal';
import createNewChat from '../api/newchat';
import useDebounce from '../hooks/useDebounce';
import '../styles/Chats.css';

const ERROR_TEXT = 'Failed to create chat. Please try again.';

const Sidebar = () => {
    const [chats, setChats] = useState([]);
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, token } = useAuth();
    const { socket } = useSocket();
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedQuery = useDebounce(searchQuery, 300);
    const selectedChatId = searchParams.get('conversation'); //tuple
    const filtered = useMemo(() => {
        const q = debouncedQuery.toLowerCase();
        return chats.filter(item =>
        item.name.toLowerCase().startsWith(q)
    )}, [chats, debouncedQuery]);

    const handleChatClick = useCallback((chatId) => {
        setSearchParams({ conversation: chatId });
        setChats(prevChats => prevChats.map(chat => chat._id === chatId ? { ...chat, unreadCount: 0 } : chat));
    }, [setSearchParams]);

    const handleNewChatClick = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => {setOpen(false); setUsername('');}, []);

    const formatChat = useCallback((chat) => {
        const otherParticipant = chat.participants.find(p => p.username !== user.username);
        return {
            _id: chat._id,
            name: otherParticipant.username,
            lastMessage: chat.lastMessage ? chat.lastMessage.content : 'No messages yet',
            time: chat.lastMessage ? formatTime(new Date(chat.lastMessage.timestamp)) : '',
            lastMessageBy: chat.lastMessage ? (chat.lastMessage.sentBy === user.id ? 'You' : otherParticipant.username) : '',
            unreadCount: chat.unreadCount || 0,
        };
    }, [user]);

    const fetchChats = useCallback(async () => {
        if (!token) {setChats([]); return;}
        try {
            const data = await getChats(token);
            if (data) {
                const formattedChats = data.map(chat => formatChat(chat));
                setChats(formattedChats);
            }
            toast.success('Conversations loaded successfully');
        } catch (error) {toast.error('Failed to fetch conversations. Please try again later.');}
    }, [token, formatChat]);

    const handleCreateChat = useCallback(async () => {
        try {
            const { status, data } = await createNewChat(username, token);
            if (!status || !data) {toast.error(ERROR_TEXT); return;}
            if (status === 201) {
                setSearchParams({ conversation: data._id });
                const newChat = formatChat(data, user);
                setChats(prev => [...prev, newChat]);
                handleClose();
            } else if (status === 409) {
                toast.info(data.message || 'Chat already exists with this user');
                handleChatClick(data.conversationId);
                handleClose();
            } else {toast.error(data.message || ERROR_TEXT);}
        } catch (error) {toast.error(ERROR_TEXT);}
    }, [username, token, formatChat, user, handleChatClick, handleClose, setSearchParams]);

    // updates the order of chat, timestamp, unread count, and last message
    const handleNewMessage = useCallback((message) => { 
        setChats(prev => {
            const idx = prev.findIndex(chat => chat._id === message.conversationId);
            if (idx !== -1) {
                const updatedChats = prev.map(chat =>
                    chat._id === message.conversationId ? {
                        ...chat,
                        lastMessage: message.content,
                        time: formatTime(new Date(message.timestamp)),
                        unreadCount: message.senderId._id === user.id ? 0 : (chat.unreadCount || 0) + 1,
                        lastMessageBy: chat.lastMessage ? (message.senderId._id === user.id ? 'You' : message.senderId.username) : '',
                    } : chat
                );
                const chatIdx = updatedChats.findIndex(chat => chat._id === message.conversationId);
                if (chatIdx > 0) {
                    const [updated] = updatedChats.splice(chatIdx, 1);
                    updatedChats.unshift(updated);
                }
                return updatedChats;
            } else {
                const newChat = {
                    _id: message.conversationId,
                    name: message.senderId.username,
                    lastMessage: message.content,
                    time: formatTime(new Date(message.timestamp)),
                    unreadCount: 1,
                    lastMessageBy: message.senderId.username,
                };
                return [newChat, ...prev];
            }
        })}, [user]);

    useEffect(() => {
        if (!user || !socket) return;
        fetchChats();
        socket.on('new_message', handleNewMessage);
        return () => socket.off('new_message', handleNewMessage);
    }, [user, socket, fetchChats, handleNewMessage]);

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