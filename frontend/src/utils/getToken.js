const getToken = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) return accessToken;
    return null;
}
export default getToken;
