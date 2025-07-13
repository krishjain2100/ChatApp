import {useState, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import getChat from '../api/chat';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [conversationInfo, setConversationInfo] = useState(null);
    const [searchParams] = useSearchParams();
    const conversationId = searchParams.get('conversation');
    const { user, token } = useAuth();

    useEffect(() => {
        const fetchMessages = async () => {
            if (!conversationId || !user || !token) {
                setMessages([]);
                setConversationInfo(null);
                return;
            }
            const data = await getChat(conversationId, token);
            
            if (data.conversation && data.conversation.participants) {
                const otherParticipant = data.conversation.participants.find(
                    participant => participant._id !== user.id
                );
                
                if (otherParticipant) {
                    setConversationInfo({
                        name: otherParticipant.username,
                        avatar: otherParticipant.username.charAt(0).toUpperCase()
                    });
                }
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

    return (
        <div className="chat-wrapper">
            {conversationId && (
                <>
                    <div className="chat-header">
                        <div className="chat-header-avatar"> 
                            {conversationInfo?.avatar || '?'} 
                        </div>
                        <div className="chat-header-info">
                            <h3 className="chat-header-name"> 
                                {conversationInfo?.name || 'Unknown User'} 
                            </h3>
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
                    </div>

                    <div className="message-input-area">
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            className="message-input"
                        />
                        <button className="send-button"> Send </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Chat;