import '../styles/Chat.css';
const messages = [
    { id: 1, text: 'Hey! How are you doing?', sender: 'Alice Johnson', time: '2:25 PM', isMe: false },
    { id: 2, text: 'I\'m doing great! Thanks for asking 😊', sender: 'Me', time: '2:26 PM', isMe: true },
    { id: 3, text: 'That\'s awesome! Are you free this weekend?', sender: 'Alice Johnson', time: '2:27 PM', isMe: false },
    { id: 4, text: 'Yes, I am! What did you have in mind?', sender: 'Me', time: '2:28 PM', isMe: true },
    { id: 5, text: 'Maybe we could grab coffee and catch up?', sender: 'Alice Johnson', time: '2:29 PM', isMe: false },
    { id: 6, text: 'Sounds perfect! What time works for you?', sender: 'Me', time: '2:29 PM', isMe: true },
    { id: 7, text: 'How about 2 PM on Saturday?', sender: 'Alice Johnson', time: '2:30 PM', isMe: false }
];

const Chat = () => {
    return (
        <div className="chat-wrapper">
            <div className="chat-header">
                <div className="chat-header-avatar"> A </div>
                <div className="chat-header-info">
                    <h3 className="chat-header-name">  Alice Johnson </h3>
                    <p className="chat-header-status"> Online </p>
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
        </div>
    );
}

export default Chat;