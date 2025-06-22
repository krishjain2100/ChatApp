import Header from "./Header";
import Chats from "./Chats";
import Chat from "./Chat";

const Main = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', backgroundColor: '#f0f0f0' }}>
      <div style={{ display: 'flex', flex: 0.5, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '500px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <Header/>
        <Chats />
      </div>
      <div style={{ display: 'flex', flex : 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '500px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
        <Chat />
      </div>
    </div>
  );
}
export default Main;
