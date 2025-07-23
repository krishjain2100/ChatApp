import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import useSocket from '../hooks/useSocket';
import createNewChat from '../api/newchat';
import getChats from '../api/sidebar';
import formatTime from '../utils/formatTime';
import formatChat from '../utils/formatChat';
import SidebarItems from './SidebarItems';
import NewChatModal from './NewChatModal';
import showNotification from '../utils/notificationToast';
import playNotificationSound from '../utils/notificationSound';
import '../styles/Chats.css';


const ERROR_TEXT = 'Failed to create chat. Please try again.';

const Sidebar = () => {
    const { user, token } = useAuth();
    const queryClient = useQueryClient();
    const { data: chats = [] } = useQuery({
        queryKey: ['chats'], 
        queryFn: async () => await getChats(token, user), 
        enabled: !!user && !!token,
        staleTime: Infinity,
    });
    const { mutate: createChat } = useMutation({
        mutationFn: (username) => createNewChat(username, token),
        onSuccess: (result) => { 
            const { status, data } = result;
            if (status === 201) {
                const newChat = formatChat(data, user);
                queryClient.setQueryData(['chats'], (oldData = []) => [...oldData, newChat]);
                setSearchParams({ conversation: data._id });
                handleClose();
            } else if (status === 409) {
                toast.info(data.message || 'Chat already exists with this user');
                handleChatClick(data.conversationId); 
                handleClose();
            } else { toast.error(data.message || ERROR_TEXT); }
        },
        onError: (_error) => { toast.error(ERROR_TEXT); }
    });

    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { socket } = useSocket();
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedQuery = useDebounce(searchQuery, 300);

    const selectedChatId = searchParams.get('conversation'); 
    const filtered = useMemo(() => {
        const q = debouncedQuery.toLowerCase();
        return chats.filter(item => item.name.toLowerCase().startsWith(q));
    }, [chats, debouncedQuery]);

    const handleChatClick = useCallback((chatId) => {
        setSearchParams({ conversation: chatId });
        queryClient.setQueryData(['chats'], (oldData = []) => oldData.map(chat => chat._id === chatId ? { ...chat, unreadCount: 0 } : chat));
    },[queryClient, setSearchParams]);

    const handleNewChatClick = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => {setOpen(false); setUsername('');}, []);

    useEffect(() => {
        if (!user || !socket) return;
        const handleNewMessage = (message) => { 
            queryClient.setQueryData(['chats'], (oldData = []) => {
                const idx = oldData.findIndex(chat => chat._id === message.conversationId);
                if (idx !== -1) {
                    const updatedChats = oldData.map(chat =>
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
                    return [newChat, ...oldData];
                }
            });
            if(document.hidden) playNotificationSound();
            if((message.conversationId !== searchParams.get('conversation')) && (message.senderId._id !== user.id)) {
                showNotification(message);
                queryClient.invalidateQueries(['chat', message.conversationId]);
            } else if (message.senderId._id ===  user.id) {
                const sidebar = document.querySelector('.chats-list');
                sidebar.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        socket.on('new_message', handleNewMessage);
        return () => socket.off('new_message', handleNewMessage);
    }, [user, socket, queryClient, searchParams]);

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
            handleCreateChat={() => createChat(username, token)}
        />
        </>
    );
}

export default Sidebar;