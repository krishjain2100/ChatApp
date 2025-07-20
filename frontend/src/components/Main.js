import { useEffect} from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import useAuth from "../hooks/useAuth";
import '../styles/Main.css';


const Main = () => {
  const { user, logout } = useAuth();
  useEffect(() => {
    if (!user) { logout() }
  }, [user, logout]);

  if (!user) return null; // for avoiding rendering after logout

  return (
    <div className="main-container">
      <div className="sidebar"> <Header/>
        <div className="chats-container"> <Sidebar /> </div>
      </div>
      <div className="chat-area"> <Chat /> </div>
    </div>
  );
}
export default Main;
