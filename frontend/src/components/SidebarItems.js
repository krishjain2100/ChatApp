const SidebarItems = ({chat, handleChatClick, selectedChatId}) => {
    return (
        <div 
            key={chat.id} 
            className={`chat-item ${selectedChatId === chat.id ? 'selected' : ''}`}
            onClick={() => handleChatClick(chat.id)}
        >
            <div className="chat-avatar"> {chat.name.charAt(0).toUpperCase()} </div>
            <div className="chat-content">
                <div className="chat-header">
                    <h4 className="chat-name"> {chat.name} </h4>
                    <span className="chat-time"> {chat.time} </span>
                </div>
                <div className="chat-footer">
                    <p className="chat-last-message"> {chat.lastMessage} </p>
                    {/* {chat.unread > 0 &&  <span className="unread-badge"> {chat.unread} </span>} */}
                </div>
            </div>
        </div>
    );
}

export default SidebarItems;