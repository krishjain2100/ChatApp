import { toast } from 'react-toastify';

const showNotification = (message) => {
    const showNotification = localStorage.getItem('showNotificationOnMessage') === 'true';
    if (showNotification) {
        toast.info(
            <span className="toast-message-row">
                <span className="toast-avatar"> {message.senderId.username.charAt(0).toUpperCase()} </span>
                <span> <b>{message.senderId.username}:</b> {message.content} </span>
            </span>, {icon: false}
        );
    }
}

export default showNotification;