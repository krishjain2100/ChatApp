const SidebarItems = ({chat, handleChatClick, selectedChatId}) => {
    return (
        <div 
            key={chat.id} 
            className={`chat-item ${selectedChatId === chat.id ? 'selected' : ''}`}
            onClick={() => handleChatClick(chat.id)}
        >
            <div className="chat-avatar-container">
                <div className="chat-avatar"> {chat.name.charAt(0).toUpperCase()} </div>
            </div>
            <div className="chat-content">
                <div className="chat-header">
                    <h4 className="chat-name"> 
                        {chat.name} 
                        {chat.isOnline && <span className="online-text"> • Online</span>}
                    </h4>
                    <span className="chat-time"> {chat.time} </span>
                </div>
                <div className="chat-footer">
                    <p className="chat-last-message"> {chat.lastMessage} </p>
                </div>
            </div>
        </div>
    );
}

export default SidebarItems;