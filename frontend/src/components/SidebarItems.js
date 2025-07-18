const SidebarItems = ({chat, handleChatClick, selectedChatId}) => {
    const { _id, name, lastMessage, time, isOnline, lastMessageBy, unreadCount } = chat;
    return (
        <div 
            key={_id} 
            className={`chat-item ${selectedChatId === _id ? 'selected' : ''}`}
            onClick={() => handleChatClick(_id)}
        >
            <div className="chat-avatar-container">
                <div className="chat-avatar"> {name.charAt(0).toUpperCase()} </div>
            </div>
            <div className="chat-content">
                <div className="chat-header">
                    <h4 className="chat-name"> 
                        {name} 
                        {isOnline && <span className="online-text"> • Online</span>}
                    </h4>
                    <div className="chat-meta">
                        {time && <span className="chat-time"> {time} </span>}
                        {unreadCount > 0 && <span className="unread-badge"> {unreadCount} </span>}
                    </div>
                </div>
                <div className="chat-footer">
                    <span className="chat-last-message"> {lastMessage? lastMessageBy + ': ' + lastMessage : 'No message' } </span>
                </div>
            </div>
        </div>
    );
}

export default SidebarItems;