import Header from "./Header";
import Chats from "./Chats";
import Chat from "./Chat";
import userData from "../api/userData";
import getToken from "../utils/getToken";
import { useEffect, useState } from "react";
import '../styles/Main.css';


const Main = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const accessToken = getToken();
    if (!accessToken) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return;
    }
    userData(accessToken)
      .then(fetched => {setData(fetched)})
      .catch(err => {
        console.error(err);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="main-container">
      <div className="sidebar">
        <Header/>
        <div className="user-profile">
          <div className="user-avatar"> {data.username ? data.username.charAt(0).toUpperCase() : 'U'} </div>
          <div className="user-details">
            <p className="user-name"> {data.username || 'User'}  </p>
          </div>
        </div>
        <div className="chats-container"> <Chats /> </div>
      </div>
      <div className="chat-area"> <Chat /> </div>
    </div>
  );
}
export default Main;
