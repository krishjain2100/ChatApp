import '../styles/Chats.css';
const chats = [
    { id: 1, name: 'Alice Johnson', lastMessage: 'Hey! How are you doing?', time: '2:30 PM', unread: 2 },
    { id: 2, name: 'Bob Smith', lastMessage: 'See you tomorrow!', time: '1:45 PM', unread: 0 },
    { id: 3, name: 'Carol Davis', lastMessage: 'Thanks for the help 👍', time: '12:15 PM', unread: 1 },
    { id: 4, name: 'David Wilson', lastMessage: 'What time is the meeting?', time: '11:30 AM', unread: 0 },
    { id: 5, name: 'Emma Brown', lastMessage: 'Can you review this document?', time: 'Yesterday', unread: 3 }
];
const Chats = () => {
    return (
        <div className="chats-wrapper">
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    className="search-input"
                />
            </div>
            <div className="chats-list">
                {chats.map(chat => (
                    <div key={chat.id} className={`chat-item ${chat.id === 1 ? 'selected' : ''}`}>
                        <div className="chat-avatar"> {chat.name.charAt(0)} </div>
                        <div className="chat-content">
                            <div className="chat-header">
                                <h4 className="chat-name"> {chat.name} </h4>
                                <span className="chat-time"> {chat.time} </span>
                            </div>
                            <div className="chat-footer">
                                <p className="chat-last-message"> {chat.lastMessage} </p>
                                {chat.unread > 0 &&  <span className="unread-badge"> {chat.unread} </span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Chats;