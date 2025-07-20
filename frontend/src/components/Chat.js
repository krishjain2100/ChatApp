import { useState, useEffect, useRef, useCallback} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import getChat from '../api/chat';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import formatMessage from '../utils/formatMessage';
import '../styles/Chat.css';

const Chat = () => {
    const [searchParams] = useSearchParams();
    const conversationId = searchParams.get('conversation');
    const { user, token } = useAuth();
    const { socket } = useSocket();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const queryClient = useQueryClient();
    const { data = {}} = useQuery({
        queryKey: ['chat', conversationId],
        queryFn: async () => await getChat(conversationId, token, user),
        enabled: !!conversationId,
        staleTime: 1000 * 60 * 5, 
    });

    const { conversationInfo, messages = [] } = data || {};

    const handleSendMessage = useCallback(() => {
        if (!newMessage.trim()) return;
        const messageData = {
            conversationId,
            senderId: user.id,
            content: newMessage.trim(),
        };
        socket.emit('send_message', messageData);
        setNewMessage('');
    }, [newMessage, conversationId, user.id, socket]);

    useEffect(() => {
        if (!conversationId || !user || !socket) return;
        const handleNewMessage = (message) => {
            const formatted = formatMessage(message, user.id);
            queryClient.setQueryData(['chat', conversationId], (oldData) => {
                if (!oldData) return oldData;
                const newMessages = [...(oldData.messages || []), formatted];
                return {...oldData, messages: newMessages};
            });
        };
        socket.emit('join_chat', conversationId);
        socket.on('new_message_private', handleNewMessage);
        return () => {
            socket.off('new_message_private', handleNewMessage);
            socket.emit('leave_chat', conversationId);
        };
    }, [conversationId, user, socket, queryClient]);

    useEffect(() => {
       messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
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
                            onKeyDown={(e) =>  {if (e.key === 'Enter') handleSendMessage()}}
                        />
                        <button className="send-button" onClick={handleSendMessage}> Send </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Chat;