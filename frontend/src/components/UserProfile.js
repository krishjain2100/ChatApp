const UserProfile = ({ userData }) => {
    const { username } = userData || {username: 'User'};
    return (
        <div className="user-profile">
            <div className="user-avatar"> {username.charAt(0).toUpperCase()} </div>
            <div className="user-details">
            <p className="user-name"> {username}  </p>
            </div>
        </div>
    )
}
export default UserProfile;