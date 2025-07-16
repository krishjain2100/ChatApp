import {useState, useEffect, useRef} from 'react';
import { useSearchParams } from 'react-router-dom';
import getChat from '../api/chat';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
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

    useEffect(() => {
        const fetchMessages = async () => {
            if (!conversationId || !user || !token) {
                setMessages([]);
                setConversationInfo(null);
                return;
            }
            const data = await getChat(conversationId, token);
            
            if (data.conversation) {
                const otherParticipant = data.conversation.participants.find(
                    participant => participant._id !== user.id
                );
                const lastSeen = new Date(otherParticipant.lastSeen);
                const isOnline = lastSeen && (new Date() - lastSeen) < 2 * 60 * 1000; 
                setConversationInfo({
                    name: otherParticipant.username,
                    avatar: otherParticipant.username.charAt(0).toUpperCase(),
                    lastSeen: lastSeen,
                    isOnline: isOnline,
                    lastSeenText: isOnline ? 'Online' : (lastSeen ? `Last seen ${formatTime(lastSeen)}` : '')
                });
            }
            const messages = data.messages || [];
            setMessages(messages.map(msg => ({
                id: msg._id,
                text: msg.content,
                sender: msg.senderId.username,
                time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: msg.senderId._id === user.id
            })));
        };
        fetchMessages();
    }, [conversationId, user, token]); 

    useEffect(() => {
        if (!conversationId || !user || !socket) return;
        socket.emit('join_chat', conversationId);

        const handleNewMessage = (message) => {
            const formattedMessage = {
                id: message._id,
                text: message.content,
                sender: message.senderId.username || 'Unknown',
                time: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: message.senderId === user.id
            };
            setMessages(prev => [...prev, formattedMessage]);
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
            socket.emit('leave_chat', conversationId);
        };
    }, [conversationId, user, socket]);

    const sendMessage = () => {
        if (!newMessage.trim() || !socket || !user) return;
        const messageData = {
            conversationId,
            senderId: user.id,
            content: newMessage.trim()
        };
        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    const handleKeyPress = (e) =>  {if (e.key === 'Enter') sendMessage()}
    const scrollToBottom = () =>  messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
                            onKeyPress={handleKeyPress}
                        />
                        <button className="send-button" onClick={sendMessage}> Send </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Chat;