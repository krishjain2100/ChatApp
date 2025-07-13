import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to ChatApp</h1>
      <p className="home-subtitle">
        Connect with friends and start conversations. Sign in to your account or create a new one to get started.
      </p>
      <div className="home-buttons">
        <a href="/login" className="home-button primary">Login</a>
        <a href="/register" className="home-button secondary">Register</a>
      </div>
    </div>
  );
}
export default Home;