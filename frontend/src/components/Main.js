import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { useAuth } from "../contexts/AuthContext";
import '../styles/Main.css';

const Main = () => {
  const [userData, setUserData] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      logout(); 
      return; 
    }
    setUserData({
      id: user.id,
      username: user.username
    });
  }, [user, logout]);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="main-container">
      <div className="sidebar">
        <Header/>
        <div className="chats-container"> <Sidebar /> </div>
      </div>
      <div className="chat-area"> <Chat /> </div>
    </div>
  );
}
export default Main;
