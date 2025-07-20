import {useState, useEffect, useRef, useCallback} from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import getChat from '../api/chat';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import formatTime from '../utils/formatTime';
import '../styles/Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [conversationInfo, setConversationInfo] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [searchParams] = useSearchParams();
    const conversationId = searchParams.get('conversation');
    const { user, token } = useAuth();
    const { socket } = useSocket();
    const messagesEndRef = useRef(null);

    const formatMessage = useCallback((message) => ({
        id: message._id,
        text: message.content,
        sender: message.senderId.username || 'Unknown',
        time: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: message.senderId._id === user.id
    }), [user.id]);

    const sendMessage = useCallback(() => {
        if (!newMessage.trim() || !socket || !user) return;
        const messageData = {
            conversationId,
            senderId: user.id,
            content: newMessage.trim()
        };
        socket.emit('send_message', messageData);
        setNewMessage('');
    }, [newMessage, socket, user, conversationId]);


    const handleKeyPress = useCallback((e) =>  {if (e.key === 'Enter') sendMessage()}, [sendMessage]);
    const scrollToBottom = useCallback(() =>  messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }), []);

    const fetchMessages = useCallback(async () => {
        if (!conversationId || !user || !token) {
            setMessages([]);
            setConversationInfo(null);
            return;
        }
        const data = await getChat(conversationId, token);
        const otherParticipant = data.participants.find(participant => participant._id !== user.id);
        const lastSeen = new Date(otherParticipant.lastSeen);
        const isOnline = lastSeen && (new Date() - lastSeen) < 2 * 60 * 1000; 
        setConversationInfo({
            name: otherParticipant.username,
            avatar: otherParticipant.username.charAt(0).toUpperCase(),
            lastSeen: lastSeen,
            isOnline: isOnline,
            lastSeenText: isOnline ? 'Online' : (lastSeen ? `Last seen ${formatTime(lastSeen)}` : '')
        });
        const messages = data.messages || [];
        setMessages(messages.map(msg => formatMessage(msg)));
        toast.success('Messages loaded successfully');
    }, [conversationId, user, token, formatMessage]);


    const handleNewMessage = useCallback((message) => {
        const formattedMessage = formatMessage(message);
        setMessages(prev => [...prev, formattedMessage]);
    }, [formatMessage]);


    useEffect(() => {
        if (!conversationId || !user || !socket) return;
        socket.emit('join_chat', conversationId);
        fetchMessages();
        socket.on('new_message_private', handleNewMessage);
        return () => {
            socket.off('new_message_private', handleNewMessage);
            socket.emit('leave_chat', conversationId);
        };
    }, [conversationId, user, socket, formatMessage, handleNewMessage, fetchMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    return (
        <div className="conversation-wrapper">
            {conversationId && (
                <>
                    <div className="conversation-header">
                        <div className="conversation-avatar"> 
                            {conversationInfo?.avatar || '?'} 
                            {conversationInfo?.isOnline && <div className="online-indicator"></div>}
                        </div>
                        <div className="conversation-header-info">
                            <h3 className="conversation-header-name"> 
                                {conversationInfo?.name || 'Unknown User'} 
                            </h3>
                            <p className={`conversation-header-status ${conversationInfo?.isOnline ? 'online' : 'offline'}`}>
                                {conversationInfo?.lastSeenText || ''}
                            </p>
                        </div>
                    </div>

                    <div className="messages-area">
                        {messages.map(message => (
                            <div key={message.id} className={`message-container ${message.isMe ? 'my-message' : 'other-message'}`}>
                                <div className={`message-bubble ${message.isMe ? 'my-message' : 'other-message'}`}>
                                    <p className="message-text"> {message.text} </p>
                                    <span className={`message-time ${message.isMe ? 'my-message' : 'other-message'}`}> {message.time} </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} /> 
                    </div>

                    <div className="message-input-area">
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            className="message-input"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button className="send-button" onClick={sendMessage}> Send </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Chat;