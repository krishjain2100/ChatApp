const Home = () => {
  return (
    <>
      <div className="home">
        <h1>Welcome to the Home Page</h1>
        <p>This is the main page of our application.</p>
      </div>
      <a href="/login" style={{ marginRight: '10px' }}>Login</a>
      <a href="/register">Register</a>
    </>
  );
}
export default Home;