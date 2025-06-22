import Header from "./Header";
import Chats from "./Chats";
import Chat from "./Chat";
import userData from "../api/userData";
import getToken from "../utils/getToken";
import { useEffect, useState } from "react";


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

  if (!data) return <p>Loading...</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', backgroundColor: '#f0f0f0' }}>
      <div style={{ display: 'flex', flex: 0.5, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '500px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <Header/>
        Hello {data.username}!
        <Chats />
      </div>
      <div style={{ display: 'flex', flex : 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '500px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <Chat />
      </div>
    </div>
  );
}
export default Main;
