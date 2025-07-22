import { useCallback, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Tooltip from '@mui/material/Tooltip';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import '../styles/Header.css';


const Header = () => {
    const { user, logout } = useAuth();
    const [soundOn, setSoundOn] = useState(() => {
        const stored = localStorage.getItem('playSoundOnMessage');
        return stored === null ? true : stored === 'true';
    });
    const [notifOn, setNotifOn] = useState(() => {
        const stored = localStorage.getItem('showNotificationOnMessage');
        return stored === null ? true : stored === 'true';
    });
    const toggleSound = useCallback(() => {
        setSoundOn(prev => {
            localStorage.setItem('playSoundOnMessage', !prev);
            return !prev;
        });
    }, []);
    const toggleNotif = useCallback(() => {
        setNotifOn(prev => {
            localStorage.setItem('showNotificationOnMessage', !prev);
            return !prev;
        });
    }, []);

    return (
        <header className="header">
            <div className="header-content">
                {user && (
                    <div className="user-info">
                        <div className="user-avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="username">{user.username}</span>
                    </div>
                )}
                <div className="header-controls">
                    <Tooltip title={soundOn ? 'Mute Sound' : 'Unmute Sound'} placement="bottom" arrow>
                        <button onClick={toggleSound} className="icon-btn">
                            {soundOn ? <VolumeUpRoundedIcon/> : <VolumeMuteRoundedIcon />}
                        </button>
                    </Tooltip>
                    <Tooltip title={notifOn ? 'Disable Notifications' : 'Enable Notifications'} placement="bottom" arrow>
                        <button onClick={toggleNotif} className="icon-btn">
                            {notifOn ? <NotificationsActiveRoundedIcon/> : <NotificationsNoneRoundedIcon />}
                        </button>
                    </Tooltip>
                    <button onClick={logout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;