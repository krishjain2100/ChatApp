const playNotificationSound = () => {
    const playSoundOnMessage = localStorage.getItem('playSoundOnMessage') === 'true';
    if (playSoundOnMessage) {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(err => console.error('Error playing sound:', err));
    }
}

export default playNotificationSound;